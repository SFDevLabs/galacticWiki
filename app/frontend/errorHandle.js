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

var $ = require('jquery');
var errorObj={};

errorObj.errHandle = function(err,type,status){
  if (err.responseJSON && err.responseJSON.redirect){
    errObj.loginRedirect(err);
  };
}

errorObj.loginRedirect = function(err){
  var returnURL = window.location.pathname
  var redirect = err.responseJSON.redirect
  $.ajax({
    method: "POST",
    url: "returnto",
    data: {returnURL:returnURL,_csrf:csrfToken}
  })
  .done(function( result ) {
    redirect(redirect);
  })
  .error(function( result ) {
    redirect(redirect);
  });
}

function redirect(redirect){
  window.location.href=redirect;
}


module.exports = errorObj;