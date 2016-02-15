'use strict';


const request = require('superagent');
const extractor = require('unfluff');
const URL = require('url-parse');
const _ = require('lodash');
const constants = require('./cookie.json');
const validator = require('validator');
const async = require('async');
const fs = require('fs');

const knox = require('knox');
var client = knox.createClient({
    key: ''
  , secret: ''
  , bucket: ''
});


/**
 * @name   pageRequester
 * @desc   scrape the page
 * @param  {string || obj}     String to make request
 * @param  {Function}    cb    function to return data
 * @return {[type]}            [description]
 */
exports.pageRequester = function(url, cb) {
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

/**
 * @name   pageRequester
 * @desc   scrape the page
 * @param  {string || obj}     String to make request
 * @param  {Function}    cb    function to return data
 * @return {[type]}            [description]
 */
exports.pageRequester = function(url, cb) {
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

/**
 * @name  Upload static article asset files to CDN
 * @param  {object}      article [description]
 * @return {string}          header
 */
exports.copyAssets = function(article){


  var favicon = article.favicon

  if (!favicon){
    let url = URL(article.canonicalLink).pathname
    favicon = 'http://'+urlhost+url.pathname;
  }

  async.parallel([
      function(cb){ 
        const imageUID =  'image_'+article._id;
        upload(article.image, imageUID, function(err, url){
          cb(null, url);
        });
      },
      function(cb){ 
        const faviconUID =  'favicon_'+article._id;
        upload(favicon, faviconUID, function(err, url){
          cb(null, url);
        });
      }
  ], function(err, results){
      console.log(results)
      article.imageCDN = results[0]
      article.faviconCDN = results[1]
      article.favicon = favicon;
      article.save(function(err){
        if(err){
          console.log(err);
        }
      });
  });


};


/**
 * @name   upload to CDN
 * @desc   upload a file to S3
 * @param  {string}      url [description]
 * @return {string}          header
 */
function upload(url, uID, cb){
  const path = URL(url).pathname;
  const extension = path.match( /\.([0-9a-z]+)(?:[\?#]|$)/i)[0];
  const location = '/tmp/'+uID+extension;
  const destination = fs.createWriteStream(location);
  request(url)
  .pipe(destination)
  .on('finish', function(){
    const stats = fs.statSync(location)
    const fileSizeInBytes = stats["size"]
    const req = client.put(uID+extension, {
      'Content-Length': fileSizeInBytes,
      'x-amz-acl': 'public-read'
    });

    fs.createReadStream(location).pipe(req);

    req.on('response', function(knoxRes){
        

        if (200 == knoxRes.statusCode) {

          cb(null, req.url)

        }else{
          cb({
            status: 'S3 Upload Failed'
          });
        }
    });

  })
  .on('error', function(error){
    cb({
      status: 'File Downlaod failed'
    });
      
  })
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
    var url = new URL(inputURL);
    if (url.hostname.match('nytimes.com') !== null) {
        return constants.NYT
    } else {
        return ''
    }
}



