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
var TodoConstants = require('../constants/ArticleConstants');

var ArticleActions = {

  /**
   * @param  {string} text
   */
  fetch: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_FETCH,
      id: id
    });
  },


  /**
   * @param  {string} text
   */
  relationsFetchAll: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.RELATIONS_FETCHALL,
    });
  },
  

  /**
   * @param  {string} text
   */
  create: function(inputs) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.EDGE_CREATE,
      inputs: inputs
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY,
      id: id
    });
  },


};

module.exports = ArticleActions;
