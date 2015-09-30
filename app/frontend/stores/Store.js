/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Store
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('../constants/Constants');
var assign = require('object-assign');
var Immutable = require('immutable');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var LOADING_TOKEN = {};

var _history = [],
    _sites = Immutable.OrderedMap();

var pending = false;

var SiteRecord = Immutable.Record({
    _id: null,
    description: null,
    canonicalLink: null,
    connections: [],
    createdAt: null,
    image: null,
    imageUploaded: {files: []},
    lang: null,
    queryLink: null,
    tags: [],
    text: [],
    title: null,
    videos: []
});

var ConceptRecord = Immutable.Record({
    id : null,
    siteRecord: null,
    name: '',
    hrefs:[]
});

var EdgeRecord = Immutable.Record({
    id : null,
    description : '',
    fromConcept: {
        site : null,
        textIndex:null,
        highlight:null
    },
    toConcept: {
        site : null,
        textIndex:null,
        highlight:null
    }
});

// /**
//  * Create a TODO item.
//  * @param  {string} text The content of the TODO
//  */
function handleSearchResult(result) {
    addHistoryEntry();

    var array = _.map(result, function(res) {
        return [res._id, new SiteRecord(res)];
    });
    _sites = Immutable.OrderedMap(array);
}

function addHistoryEntry() {
    _history.push(_sites);
}

function goToHistory(index) {
    _sites = _history[index];
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
    _sites = _sites.set(id, _sites.get(id).merge(updates));
}

function updateWithHistory(id, updates) {
    addHistoryEntry();
    update(id, updates);
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
    _sites = _sites.delete(id);
}

function destroyWithHistory(id) {
    addHistoryEntry();
    destroy(id);
}

var Store = assign({}, EventEmitter.prototype, {

    /**
     * @name   getPageData
     * @desc   return the URL
     * @param  {string}  url of the page to return
     */
    getPageData: function(url) {
        return _sites.toArray();
    },
    /**
     * @name   getPageData
     * @desc   return the URL
     * @param  {boolean}  Pending status
     */
    getSearchPendingStatus: function() {
        return pending;
    },
    /**
     * @name   handleDataFromServer
     * @desc   [description]
     * @param  {[type]}      action [description]
     * @return {[type]}             [description]
     */
    handleDataFromServer: function(action) {
        _sites[1] = action.payload.data;
        this.emit('change'); // or whatever you do to re-render your app
    },
    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function() {
        return _sites.toObject();
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
    var url;

    switch (action.actionType) {
        case constants.PAGE_DATA_FROM_SERVER:
            pending = false;

            var result = action.results;
            if (result != undefined) {
                handleSearchResult(result);
            }
            Store.emitChange();
            break;

        case constants.PAGE_DATA_PENDING:
            pending = true;
            Store.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = Store;
