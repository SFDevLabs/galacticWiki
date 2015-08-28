// Routes for module
"use strict";

var userNameDiv = document.getElementById("user");
var csrfTag = document.getElementById("csrf-token");
var $ = require('jquery');

var utils ={}

utils.getUserName=function(){
	return userNameDiv.dataset.name;
}
utils.isLoggedIn=function(){
	return userNameDiv.dataset.auth==="true"?true:false;
}

utils.loginRedirect = function(redirect){
  var returnURL = window.location.pathname
  $.ajax({
    method: "POST",
    url: "returnto",
    data: {returnURL:returnURL,_csrf:utils.getCsrfToken()}
  })
  .done(function( result ) {
    window.location.href=redirect;
  })
  .error(function( result ) {
    window.location.href=redirect;
  });
}


utils.getCsrfToken = function(){
	return csrfTag ? csrfTag.dataset.csrf:null;
}



// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
utils.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};



module.exports = utils;
