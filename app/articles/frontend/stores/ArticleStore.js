/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * ArticleStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/ArticleConstants');
var assign = require('object-assign');
var Immutable = require('immutable');
var $ = require('jquery');
var CHANGE_EVENT = 'change';
var SAVE_EVENT = 'save';
var _history = [];
var _nodes = Immutable.OrderedMap();
var _edges = Immutable.OrderedMap();
var urlBase = '/apigraph/articles/';
var errorObj = require('../../../main/frontend/errorHandle');
var utils = require('../../../main/frontend/utils');
var csrfToken = utils.getCsrfToken()




var EdgeRecord = Immutable.Record({
  siteFromId: null,
  siteToId: null,
  id:null,
  user:{
    username:null,
    _id:null
  }
});

var NodeRecord = Immutable.Record({
  id:null,
  url:null,
  title:null,
  favicon:null,
  connectionCount:null
});

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(nodeOne, nodeTwo) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // Using the current timestamp + random number in place of a real id.
  $.ajax({
    method: "POST",
    url: urlBase,
    data: {
      urlOne: nodeOne.url,
      urlTwo: nodeTwo.url,
      idOne: nodeOne.id,
      idTwo: nodeTwo.id,
      titleOne: nodeOne.title,
      titleTwo: nodeTwo.title,
      _csrf: csrfToken}
  })
  .done(function( results ) {

    results.USEREDGE.forEach(function(item){
      _edges = _edges.set(item.id, new EdgeRecord(item) );
    });

    results.Sites.forEach(function(item){
      item.favicon = 'http://www.google.com/s2/favicons?domain='+url_domain(item.url)
      _nodes = _nodes.set(item.id, new NodeRecord(item) );
    });

    ArticleStore.emitSave();
  }).error(errorObj.errHandle);
}

function addHistoryEntry() {
  _history.push(_nodes);
}

function goToHistory(index) {
  _nodes = _history[index];
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  var postupdates = $.extend({_csrf:csrfToken}, updates);
  $.ajax({
    method: "PUT",
    url: urlBase+id,
    data: postupdates
  })
  .done(function( result ) {
    var id = result._id;
    delete result._id
    delete result.__v
    _nodes = _nodes.set(id, _nodes.get(id).merge(result));
    ArticleStore.emitChange();
  }).error(errorObj.errHandle);
}

function updateWithHistory(id, updates) {
  addHistoryEntry();
  update(id, updates);
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
  addHistoryEntry();
  for (var id in _nodes.toObject()) {
    update(id, updates);
  }
}
/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  $.ajax({
    method: "DELETE",
    url: urlBase+id,
    data: {_csrf:csrfToken}
  })
  .done(function( msg ) {
    _nodes = _nodes.delete(id);
    ArticleStore.emitChange();
  }).error(errorObj.errHandle);
}

function destroyWithHistory(id) {
  addHistoryEntry();
  destroy(id);
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  addHistoryEntry();
  for (var id in _nodes.toObject()) {
    if (_nodes.getIn([id, 'complete'])) {
      destroy(id);
    }
  }
};

  /**
   * Get the entire collection of from server.
   * @return {object}
   */
function fetchAllRelations(userName) {
      var userName = userName?userName:null;
      $.ajax({
        method: "GET",
        url: urlBase,
        data: {
          userName: userName
        }
      })
      .done(function( results ) {
        results.USEREDGE.forEach(function(item){
          _edges = _edges.set(item.id, new EdgeRecord(item) );
        });

        results.Sites.forEach(function(item){
          item.favicon = 'http://www.google.com/s2/favicons?domain='+url_domain(item.url)
          _nodes = _nodes.set(item.id, new NodeRecord(item) );
        });

        ArticleStore.emitChange();
      }).error(errorObj.errHandle);
};

// function fetchAllRelationsByUser(userID) {
//       $.ajax({
//         method: "GET",
//         url: urlBase,
//         user: userID
//       })
//       .done(function( results ) {
//         results.USEREDGE.forEach(function(item){
//           _edges = _edges.set(item.id, new EdgeRecord(item) );
//         });

//         results.Sites.forEach(function(item){
//           item.favicon = 'http://www.google.com/s2/favicons?domain='+url_domain(item.url)
//           _nodes = _nodes.set(item.id, new NodeRecord(item) );
//         });

//         ArticleStore.emitChange();
//       }).error(errorObj.errHandle);
// };

function fetchOne(id) {
    var that= this
    if (!id) return {}; ///return nothing if there is not record.
    $.ajax({
        method: "GET",
        url: urlBase+id,
    })
    .done(function( results ) {
      results.USEREDGE.forEach(function(item){
        _edges = _edges.set(item.id, new EdgeRecord(item) );
      });

      results.Sites.forEach(function(item){
          item.favicon = 'http://www.google.com/s2/favicons?domain='+url_domain(item.url)
          _nodes = _nodes.set(item.id, new NodeRecord(item) );
      });

      ArticleStore.emitChange();
    })
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = 'https://'+data;
  return a.hostname;
}

var ArticleStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAllEdges: function(username) {
    var edgesFiltered = username?_edges.filter(function(obj){
      return obj.user.username===username;
    }):_edges;


    var mappedEdges = edgesFiltered.map(function(obj){
      var item = {};
      item.siteFrom = ArticleStore.getOneNodeById(obj.siteFromId);
      item.siteTo = ArticleStore.getOneNodeById(obj.siteToId);
      item.edge = {
        user: obj.user
      }
      return item;
    });
    return mappedEdges.toObject();
  },
  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getOneNodeById: function(id) {
    var record = _nodes.get(id)
    if (!record ) return {}; ///return nothing if there is not record.
    return record.toObject();
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getOneNodeRelationsById: function(id) {
    var record = _nodes.get(id)
    if (!record ) return {}; ///return nothing if there is not record.
    var NODE_USEREDGE = _edges.filter(function(obj){
      return id===obj.siteFromId
    }).map(function(obj){
      var item = {};
      item.site = ArticleStore.getOneNodeById(obj.siteToId);
      item.user = obj.user;
      return item
    });

    return NODE_USEREDGE.toObject();;
  },

  getHistory : function () {
    return _history;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitSave: function() {
    this.emit(SAVE_EVENT);
  },


  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  addSaveListener: function(callback) {
    this.on(SAVE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeSaveListener: function(callback) {
    this.removeListener(SAVE_EVENT, callback);
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case TodoConstants.EDGE_CREATE:
      inputs = action.inputs;
      if (inputs[0] && inputs[1] && inputs[0].url !=='' && inputs[1].url !== '') {
        create(
          inputs[0],
          inputs[1]
        );
      }
      break;

    case TodoConstants.TODO_HISTORY_SET:
      goToHistory(action.index);
      ArticleStore.emitChange();
      break;

    case TodoConstants.TODO_UPDATE:
      text = action.text.trim();
      if (text !== '') {
        updateWithHistory(action.id, {text: text});
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroyWithHistory(action.id);
      break;

    case TodoConstants.RELATIONS_FETCHALL:
      var id = action.id?action.id:null;
      fetchAllRelations(id);
      break;

    case TodoConstants.TODO_FETCH:
      var id = action.id;
      fetchOne(id);
      break;

    default:
      // no op
  }
});


module.exports = ArticleStore;