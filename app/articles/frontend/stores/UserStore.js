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
var urlBase = '/api/user/';
var errorObj = require('../../../main/frontend/errorHandle');
var utils = require('../../../main/frontend/utils');
var csrfToken = utils.getCsrfToken()


var UserRecord = Immutable.Record({
  siteFromId: null,
  siteToId: null,
  id:null,
  user:{
    username:null,
    _id:null
  }
});

function addHistoryEntry() {
  _history.push(_nodes);
}

function goToHistory(index) {
  _nodes = _history[index];
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

function fetch(id) {
    var that= this
    if (!id) return {}; ///return nothing if there is not record.
    $.ajax({
        method: "GET",
        url: urlBase+id,
    })
    .done(function( results ) {
      
      // results.USEREDGE.forEach(function(item){
      //   _edges = _edges.set(item.id, new EdgeRecord(item) );
      // });

      // results.Sites.forEach(function(item){
      //     item.favicon = 'http://'+url_domain(item.url)+'/favicon.ico'
      //     _nodes = _nodes.set(item.id, new NodeRecord(item) );        
      // });

      UserStore.emitChange();
    })
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = 'https://'+data;
  return a.hostname;
}

var UserStore = assign({}, EventEmitter.prototype, {


  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getOneNodeById: function(id) {
    var record = _nodes.get(id)
    if (!record ) return {}; ///return nothing if there is not record.
    return record.toObject();
  },

  getHistory : function () {
    return _history;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
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
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {

    case TodoConstants.TODO_HISTORY_SET:
      var id = action.id;
      fetch(id);
      break;

    default:
      // no op
  }
});


module.exports = UserStore;