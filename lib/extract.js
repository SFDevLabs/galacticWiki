'use strict';


const request = require('superagent');
const extractor = require('/Users/presencecomputer/repos/node-unfluff/lib/unfluff');
const URL = require('url-parse');
const _ = require('lodash');
const constants = require('./cookie.json');
const validator = require('validator');




/**
 * @name   pageRequester
 * @desc   scrape the page
 * @param  {string || obj}     String to make request
 * @param  {Function}    cb    function to return data
 * @return {[type]}            [description]
 */
exports.pageRequester = function(url, cb) {
  console.log(url)
  const path = 'http://'+url
  request
    .get(path)
    .set('Cookie', getCookie(url))
    .end(function(err, response) {
      if (!err && response.statusCode == 200) {
        var data = extractor(response.text);
        data = _.assign(data, { 'queryLink': url });
        cb(null, data);
      } else {
        cb(err, null);
      }
    });
}


exports.URLParse = function(inputURL) {
    if ( ! validator.isURL(inputURL) ) {
      return null;
    } else {
      const url = new URL(inputURL);
      const path = url.hostname + url.pathname.replace(/(\/)+$/, "");//put together host and path and remove trailing slash.
      return path
    }
}

/**
 * @name   getHeaders
 * @desc   logic to get headers
 * @param  {string}      url [description]
 * @return {string}          header
 */
const getCookie = function (inputURL) {
  console.log(inputURL, 'input')
    var url = new URL(inputURL);

    if (url.hostname.match('nytimes.com') !== null) {
        return constants.NYT
    } else {
        return ''
    }
}



