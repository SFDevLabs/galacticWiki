var API_URL = '/api/page';
var TIMEOUT = 10000;
var request = require('superagent');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var _pendingRequests = {};
var Constants = require('../constants/Constants');

function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function() {};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}

function token() {
    return UserStore.getState().token;
}

function makeUrl(part) {
    return API_URL + part;
}

// function dispatch(key, response, params) {
//     var payload = {actionType: key, response: response};
//     if (params) {
//         payload.queryParams = params;
//     }
//     AppDispatcher.handleRequestAction(payload);
// }

// return successful response, else return request Constants
function makeDigestFun(err, res) {
    if (err && err.timeout === TIMEOUT) {
        AppDispatcher.dispatch({actionType: Constants.TIMEOUT_FROM_SERVER});
    } else if (!res.ok) {
        AppDispatcher.dispatch({actionType: Constants.PAGE_ERROR_FROM_SERVER});
    } else {
        AppDispatcher.dispatch({actionType: Constants.PAGE_DATA_FROM_SERVER, results : res.body.results});
    }
};

// a get request with an authtoken param
function get(url, q) {
    return request
        .get(url)
        .query(q)
        .timeout(TIMEOUT)
}

var Api = {
    getURLData: function(searchURLString) {
        var url = makeUrl('');
        var params = {q:searchURLString}
        var key = searchURLString;
        abortPendingRequests(key);
        _pendingRequests[searchURLString] = get(url, params).end(
            makeDigestFun
        );
    }
};

module.exports = Api;
