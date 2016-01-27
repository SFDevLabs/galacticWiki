'use strict';


var request = require('superagent');
var extractor = require('./node-unfluff/lib/unfluff');
var URL = require('url-parse');


exports.getPage = function (url, cb) {
  var url = URLParse(req.query.q)
  if (!url || !utils.urlValidate(url)) { return res.status(200).json({error:'No Query or Valid URL', results:[]}) };// here we should do a title search.
  async.waterfall([
      function(cb){cb(null,url)},
      pageDBSearch,
      pageRequester,
  ], cb);
};

/**
 * @name   pageDBSearch
 * @desc   Searches the DB for the page.
 * @param  {string}      url
 * @param  {Function}    cb  a callback for the data.
 */
var pageDBSearch = function(url, cb) {
  Site
    .findOne({'$or':[{ canonicalLink: url }, { queryLink: url }]})
    .exec(function(err, result){
        if (err){
          cb(err)
        } else if (result!==null) {
            console.log('db')
          cb(null, result);
        } else {
            console.log('parse')
          cb(null, url);
        }
    });
}

/**
 * @name   pageRequester
 * @desc   scrape the page
 * @param  {string || obj}     String to make request
 * @param  {Function}    cb    function to return data
 * @return {[type]}            [description]
 */
var pageRequester = function(input, cb) {
  if (typeof input === 'string'){
    var url = input;
    request
      .get(URLParse(url))
      .set('Cookie', getCookie(url))
      .end(function(err, response) {
        console.log(response.statusCode)
        if (!err && response.statusCode == 200) {
          var data = extractor(response.text);
          data = _.assign(data, { 'queryLink': url, 'canonicalLink':url });
          var site = new Site(data);
          site.save(function(err){
            cb(null, site);
            if(err){log.log("Error", err)}
          });
        } else {
          cb(err);
        }
      });
    } else{
      var data = input;
      cb(null, data);
    }

}

/**
 * @name   getHeaders
 * @desc   logic to get headers
 * @param  {string}      url [description]
 * @return {string}          header
 */
const getCookie = function (inputURL) {
    console.log(inputURL)
    var url = new URL(inputURL);

    if (url.hostname.match('nytimes.com') !== null) {
        return COOKIE_CONSTANTS.NYT
    } else {
        return ''
    }
}

const URLParse = function(inputURL) {
    var url = new URL(inputURL);
    var fullPath = url.hostname + url.pathname.replace(/(\/)+$/, "");//put together host and path and remove trailing slash.
    return fullPath;
}

