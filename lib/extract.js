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
const validUrl = require('valid-url');
const toMarkdown = require('to-markdown');

const knox = require('knox');
var client = knox.createClient({
    key: 'AKIAI6HPTMAQXETOY5WA'
  , secret: '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'
  , bucket: 'galacticapp'
});

/**
 * @name   pageRequester
 * @desc   scrape the page
 * @param  {string || obj}     String to make request
 * @param  {Function}    cb    function to return data
 * @return {[type]}            [description]
 */
exports.pageRequester = function(url, cb) {
  const queryLink = { 'queryLink': url };

  const path = 'http://'+url
  request
    .get(path)
    .set('Cookie', getCookie(url))
    .end(function(err, response) {
      if (!err && response.statusCode == 200) {

        var data = extractor(response.text);
        data = _.assign(data, queryLink);

       if( !data.canonicalLink || !validUrl.isUri(data.canonicalLink) ){
          data.canonicalLink = 'http://'+data.queryLink;
        }

        const urlObj = URL(data.canonicalLink)

        data.image = data.image?urlFix(data.image, urlObj.host):null;
        data.favicon = data.favicon?urlFix(data.favicon, urlObj.host):null;

 
        if (!data.favicon || data.favicon.length==0){
          const domainLink = 'http://'+url;
          data.favicon = domainLink+'/favicon.ico'
        };

        const parseResult = parseTags(data.html, urlObj);
        data.text = parseResult.text;
        data.links = parseResult.links;

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
function parseTags(txts, urlObj){
  var tags = [];
  return {
    text:_.map(txts, function(txt, i){
      const paragraphIndex = i;
      const result = pull(txt, paragraphIndex, urlObj);
      tags = tags.concat(result.tags);
      return result.text;
    }),
    links: tags
  }
}

/**
 * @name  Parse the tags out of the html from the parse.
 * @param  {txt} 
 * @return {obj} Pulled text 
 */
function pull(txt, paragraphIndex, urlObj){
  var opentag={}
  var pulledText = '';
  var tags = [];
  var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
          opentag[name]={
            name: name,
            index : [pulledText.length],
            paragraphIndex: paragraphIndex
          };
          console.log(name, attribs.href)
          if (name==='a' && attribs.href){
            opentag[name]['href'] = urlFix( attribs.href,  urlObj);
          };
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
    tags: _.filter(tags, {name:'a'})
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
const urlFix = function(inputURL, inputHostName) {
  console.log(inputURL)
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
exports.urlFix = urlFix;

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



