/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/Constants');
var assign = require('object-assign');
var Immutable = require('immutable');

var CHANGE_EVENT = 'change';

var _history = [],
    _sites = Immutable.OrderedMap();

var SiteRecord = Immutable.Record({
    id : null,
    title: null,
    text: '',
    hrefs:[]
});

var ConceptRecord = Immutable.Record({
    id : null,
    name: '',
    hrefs:[]
});

var EdgeRecord = Immutable.Record({
    id : null,
    description : '',
    fromConcept: null,
    toConcept: null
});

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
    // Hand waving here -- not showing how this interacts with XHR or persistent
    // server-side storage.
    // Using the current timestamp + random number in place of a real id.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

    addHistoryEntry();
    _sites = _sites.set(id, new SiteRecord({id : id, text : text}));
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
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(updates) {
    addHistoryEntry();
    for (var id in _sites.toObject()) {
        update(id, updates);
    }
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

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
    addHistoryEntry();
    for (var id in _sites.toObject()) {
        if (_sites.getIn([id, 'complete'])) {
            destroy(id);
        }
    }
}

var TodoStore = assign({}, EventEmitter.prototype, {

    /**
     * Tests whether all the remaining TODO items are marked as completed.
     * @return {boolean}
     */
    areAllComplete: function() {
        for (var id in _sites) {
            if (!_sites.getIn([id, 'complete'])) {
                return false;
            }
        }
        return true;
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
    var text;

    switch (action.actionType) {
        case TodoConstants.TODO_CREATE:
            text = action.text.trim();
            if (text !== '') {
                create(text);
            }
            Store.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = TodoStore;
