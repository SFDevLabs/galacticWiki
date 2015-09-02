/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

    /**
     * @param  {string} text
     */
    create: function(text) {
        AppDispatcher.dispatch({
            actionType: Constants.TODO_CREATE,
            text: text
        });
    },

    goToHistory: function (index) {
        AppDispatcher.dispatch({
            actionType: Constants.TODO_HISTORY_SET,
            index : index
        });
    }

};

module.exports = Actions;
