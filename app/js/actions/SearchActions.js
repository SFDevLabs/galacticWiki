/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');
const SearchApi = require('../api/SearchApi');


const Actions = {

  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getList: function(count, skip, q, clearStore) {
    SearchApi.getEntityListData(count, skip, q);
    if (clearStore){
      AppDispatcher.dispatch({actionType: Constants.CLEAR_SEARCH_DATA})
    }
  },
};

module.exports = Actions;
