/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/


const Constants = require('../constants/Constants');
const RequestAPI = require('./Api');

var _pendingRequests = {};

const API_URL = '/api/search';

function makeUrl(part) {
  return API_URL + part;
}

//API calls
var ArticleApi = {
  getEntityListData: function(count, skip, q) {
    const url = makeUrl('');
    const key = Constants.GET_SEARCH_DATA;
    const params = {count: count, skip:skip, q:q};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params)
    );
  }
};

module.exports = ArticleApi;