var API_URL = '/api/v2';
var TIMEOUT = 10000;
var request = require('superagent');
var AppDispatcher = require('../actions/Actions');
var _pendingRequests = {};

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
        AppDispatcher.handleRequestTimeout(res, params);
    } else if (!res.ok) {
        AppDispatcher.handleRequestError(res, params);
    } else {
        AppDispatcher.handleRequestSuccess(res, params);
    }
};

// a get request with an authtoken param
function get(url, q) {
    return request
        .get(url)
        .query(q)
        .timeout(TIMEOUT)
        .query({authtoken: token()});
}

var Api = {
    getURLData: function(searchURLString) {
        var url = makeUrl('/entities/' + entityId);
        var params = {q:searchURLString}
        abortPendingRequests(key);
        AppDispatcher.handleRequestPending(searchURLString);
        _pendingRequests[searchURLString] = get(url, params).end(
            makeDigestFun
        );
    }
};

module.exports = Api;
