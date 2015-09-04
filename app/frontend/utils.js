// Routes for module
'use strict';

var userNameDiv = document.getElementById('user');
var csrfTag = document.getElementById('csrf-token');
var fetch = require('whatwg-fetch');

var utils = {}

utils.getUserName = function() {
    return userNameDiv.dataset.name;
}
utils.isLoggedIn = function() {
    return userNameDiv.dataset.auth === 'true' ? true : false;
}

utils.loginRedirect = function(redirect) {
    var returnURL = window.location.pathname
    fetch('returnto', {
        method: 'post',
        body: {returnURL:returnURL, _csrf:utils.getCsrfToken()}//new FormData(form)
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        window.location.href = redirect;
    }).catch(function(ex) {
        window.location.href = redirect;
    });
}

utils.getCsrfToken = function() {
    return csrfTag ? csrfTag.dataset.csrf : null;
}

module.exports = utils;
