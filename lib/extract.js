'use strict';


const request = require('superagent');
const extractor = require('unfluff');
const URL = require('url-parse');
const _ = require('lodash');
const constants = require('./cookie.json');
const validator = require('validator');
const async = require('async');
const fs = require('fs');
const sizeOf = require('image-size');
const htmlparser = require("htmlparser2");

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
        data.text = parseTags(data.html);
        data = _.assign(data, { 'queryLink': url });
        cb(null, data);
      } else {
        cb(err, null);
      }
    });
}

/**
 * @name Loop through the paragraphs.
 * @param  {string} txt
 * @return 
 */
function parseTags(txts){
  return _.map(txts, function(txt, i){
    return pull(txt)
  })
}

/**
 * @name  Parse the tags out of the html from the parse.
 * @param  {txt} 
 * @return {obj} Pulled text 
 */
function pull(txt){
  var opentag={}
  var pulledText = '';
  var tags = [];
  var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
          opentag[name]={
            name: name,
            index : [pulledText.length]
          };
          if (name==='a'){opentag[name]['href'] = attribs.href};
      },
      ontext: function(text){
        pulledText += text;
          console.log("-->", text);
      },
      onclosetag: function(tagname){
        opentag[tagname].index[1]=pulledText.length;
        tags.push(opentag[tagname]);
      }
  }, {decodeEntities: true});
  parser.write(txt);
  parser.end();
  return {
    text: pulledText,
    style: _.filter(tags, function(value) {
      return value.name !== 'a';
    }),
    link: _.filter(tags, {name:'a'})
  }
}

/**
 * @name  Upload static article asset files to CDN
 * @param  {object}      article [description]
 * @return {string}          header
 */
exports.copyAssets = function(faviconURL, imageURL, uID, callback){
  async.parallel([
    function(cb){ 
      const imageUID =  'image_'+ uID;
      upload(imageURL, imageUID, function(err, url, dimensions){
        cb(null, {dimensions:dimensions,url:url});
      });
    },
    function(cb){ 
      const faviconUID =  'favicon_'+ uID;
      upload(faviconURL, faviconUID, function(err, url){
        cb(null, url);
      });
    }
  ], callback);
};


/**
 * @name   upload to CDN
 * @desc   upload a file to S3
 * @param  {string}      url [description]
 * @return {string}          header
 */
function upload(url, uID, cb){
  if (!url){ return cb({
      status: 'No valid URL provided for upload.'
    }, null)}
  const path = URL(url).pathname;
  const extension = path.match( /\.([0-9a-z]+)(?:[\?#]|$)/i)[0];
  const location = '/tmp/'+uID+extension;
  const destination = fs.createWriteStream(location);
  
  var req = request(url, function(err, res){
    console.log(err, url)
    if (!err && res.statusCode==200){
      request(url).pipe(destination)
        .on('finish', finish)
        .on('error', error)
    } else{
      cb({status: 'File Downlod failed'}, null)
    }
  })

  const finish = function(err, res){
    const stats = fs.statSync(location)
    const fileSizeInBytes = stats["size"]
    const req = client.put(uID+extension, {
      'Content-Length': fileSizeInBytes,
      'x-amz-acl': 'public-read'
    });
    fs.createReadStream(location).pipe(req);
    req.on('response', function(knoxRes){
        if (200 == knoxRes.statusCode) {
          const dimensions = location.match(/\.gif|\.jpg|\.jpeg|\.png/)!==null ?
            (function(){
             const size = sizeOf(location);
              return [size.width, size.height]
            })():
            [];
          cb(null, req.url, dimensions)
        }else{
          cb({status: 'S3 Upload Failed'}, null, null);
        }
    });
  };

  const error = function(error){
    cb({
      status: 'File Downlod failed'
    }, null);
  };

}


/**
 * @name   URLParse
 * @desc   logic to get headers
 * @param  {string}      inputURL [description]
 * @return {string}      path
 */
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
 * @name   Normalizing urlFixs to have protocol hostName and path.
 * @desc   logic to get headers
 * @param  {string}      url [description]
 * @return {string}          header
 */
exports.urlFix = function(inputURL, inputHostName) {
  var url = new URL(inputURL);
  var hostName; 
  var protocol;
  if (url.hostname.length==0 && inputHostName){
    hostName = inputHostName
  }else{
    hostName = url.hostname
  }
  if (url.protocol.length==0){
    protocol = 'http:'
  }else{
    protocol = url.protocol
  }
  console.log(url)
  return protocol+'//'+hostName+url.pathname+url.query;
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



