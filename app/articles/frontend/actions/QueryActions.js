/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var QueryConstants = require('../constants/QueryConstants');

var QueryActions = {
  /**
   * @param  {string} text
   */
  query: function(text) {
    AppDispatcher.dispatch({
      actionType: QueryConstants.QUERY,
      text: text
    });
  },
  clearAllQueries: function(text) {
    AppDispatcher.dispatch({
      actionType: QueryConstants.CLEAR_ALL,
    });
  },

};

module.exports = QueryActions;
