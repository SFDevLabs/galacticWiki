'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const Article = mongoose.model('Article');
const _ = require('lodash');
const utils = require('../../lib/utils');
const extract = require('../../lib/extract')
const URLParse =extract.URLParse
const async = require('async');
const Connection = require('../models/connection');

/**
 * Example
 */
exports.example = function (req, res){


 // Connection.getNode('56de491de5c0175d09fa1064', function(err, results){
 //  res.send(results)
 // })

// const q = [
//   'CREATE (Page:page {_id:{_idOne}})-[Link:sref {textIndexFrom:{_textIndexFrom},textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->(Page2:page {_id:{_idTwo}})',
//   'RETURN Page, Link'].join('\n');

// const q = [
//   'MATCH (Page:page {_id:{_idOne}})',
//   'MATCH (Page2:page {_id:{_idTwo}})',
//   'CREATE Page-[Link:sref {textIndexFrom:{_textIndexFrom},textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->Page2',
//   'RETURN Page, Link, Page2'].join('\n');


//   //
//   Connection.db.cypher({
//       query: q,
//       params: {
//           _idOne: '123a',
//           _idTwo: '456b',
//           _textIndexFrom: [1,2],
//           _pIndexFrom: 1,
//           _textIndexTo: [1,2],
//           _pIndexTo: 1
//       },
//   }, function (err, results) {
//       if (err) throw err;
//       var result = results[0];
//       if (!result) {
//         res.send({
//           err:null,
//           message: 'No Result'
//         })
//       } else {
//         //var user = result['u'];
//         res.send(result)
//       }
//   });
  
};

/**
 * Load
 */
exports.load = function (req, res, next, id){
  Article.load(id, function (err, article) {
    if (!article || (err && err.message==='Cast to ObjectId failed')) return  res.status(404).send(utils.errsForApi('Article not found'));
    if (err) return  res.status(500).send( utils.errsForApi(err.errors || err) );
    req.article = article;

    Connection.getNode(article._id, function(err, results){
      req.sref = _.map(results, function(r, i){
        return srefParser(r)
      });
      next();
    })

    
  });
};


/**
 * @name   srefParser
 * @r     {obj} Neo4j object
 * @return {obj}    cb  a callback for the data.
 */
const srefParser = function(r){
  console.log(r, 'r')
  const pageID = r.PageTwo.properties._id; //Get the other articles uid
  const outBound = r.Link._fromId === r.PageOne._id; // See if the link is inbound or outbound
//  console.log(r.Link._fromId,'-',r.PageOne._id, outBound )
  const link = r.Link.properties; //Get the link properties
  const textIndex = outBound?link.textIndexFrom:link.textIndexTo; //Get the text index
  const paragraphIndex = outBound?link.pIndexFrom:link.pIndexTo; //Get the p index
  return {
    _id: link._id,
    index: textIndex,
    paragraphIndex: paragraphIndex,
    sref: pageID,
    outbound: outBound
  }
}

/**
 * List
 */
exports.getListController = function (req, res) {
  var skip = Number(req.query.skip)
  var count = Number(req.query.count)
  const criteria = req.query.tag?{tags:req.query.tag}:null;
  
  skip =  !isNaN(skip) ? skip : 0;
  count =  !isNaN(count) ? count : 30;
  
  var options = {
    count: count,
    skip: skip,
  };

  if (criteria){
    options.criteria = criteria
  }

  Article.list(options, function (err, result) {
    Article.count(criteria).exec(function (errCount, count) {
      if (!err) {
        res.send({
          articles:result,
          total: count
        });
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  });
};

/**
 * Create
 */
exports.getCreateController = function (req, res) {
  const q = req.body.url
  if (!q) return res.status(422).send({errors:utils.errsForApi('No Query or Valid URL')});

  async.waterfall([
      function(cb){
        var url = URLParse(q)
        if (url){
           cb(null, url)
        } else {
          cb({
            status:422,
            errors:utils.errsForApi('No Query or Valid URL'), 
            results:[]
          })
        }       
      },
      pageDBSearch,
      pageExtractor,
      pageSaver,
      connectionCreator,
  ], function(err, url, resultDB, extractedPageData){
      if (err){
        const status = err.status || 500;
        res.status(err.status).send({errors:utils.errsForApi(err.errors || err)});
      } else {
        res.send(resultDB);
      }
  });
};


/**
 * @name   pageDBSearch
 * @desc   Searches the DB for the page.
 * @param  {string}      url
 * @param  {Function}    cb  a callback for the data.
 */
function pageDBSearch(url, cb) {
  Article
    .findOne({'$or':[{ canonicalLink: url }, { queryLink: url }]})
    .exec(function(err, result){
        if (err){
          cb(err)
        } else if (result!==null) {
          cb(null, url, result);
        } else {
          cb(null, url, null);
        }
    });
}


/**
 * @name   pageExtractor
 * @desc   Logic to extact page data if we did not get a db response.
 * @param  {string}      url
 * @param  {object}    resultDB
 * @param  {Function}    cb  a callback for the data.
 */
const pageExtractor = function(url, resultDB, cb){
  if (resultDB){
    cb(null, url, resultDB, null);
  } else {
    extract.pageRequester(url, function(err, extractedPageData){
      cb(err, url, resultDB, extractedPageData);
    });
  }
}

/**
 * @name   pageSaver
 * @desc   Logic to extact save page data from extracted text data
 * @param  {string}      url
 * @param  {object}    resultDB
 * @param  {object}    extractedPageData
 * @param  {Function}    cb  a callback for the data.
 */
const pageSaver = function(url, resultDB, extractedPageData, cb){
  if (!resultDB){
    saveArticleToDB(extractedPageData, function(err, savedResultDB){
      cb(err, url, savedResultDB, extractedPageData);
    });
  } else {
    cb(null, url, resultDB);
  }
}

/**
 * @name   Creates a connection
 * @desc   Saves the db to the article
 * @param  {object}      result
 * @param  {Function}    cb  a callback for the data.
 */
const connectionCreator = function(url, resultDB, extractedPageData, cb){
  if (extractedPageData){
    Connection.createNode(
      resultDB._id,
      function (err, results) {
        cb(err, url, resultDB, extractedPageData);
    })
  }
}



/**
 * @name   saveArticleToDB
 * @desc   Saves the db to the article
 * @param  {object}      result
 * @param  {Function}    cb  a callback for the data.
 */
const saveArticleToDB = function(result, cb){
  var article = new Article(result);
  extract.copyAssets(
    article.image, 
    article.favicon,
    article._id,
    function(err, results){
      article.imageCDN = results[0];
      if (results[1]===null){
        article.favicon = null
      }
      article.faviconCDN = results[1];
      article.save(function(err){
        if(err){
          console.log(err);
        }
      });
  });

  article.save(function(err){
    cb(err, article);
  });
}


/**
 * Create Connection
 */
exports.getCreateSREFController = function (req, res) {  

  const body = req.body;
  const article = req.article;
  const sref = req.sref;


  const idFrom = req.article._id;
  const idTo = body.idTo;

  const textIndexFrom = _.map(body.textIndexFrom, function(val){ return Number(val) });
  const pIndexFrom =  Number(body.pIndexFrom);

  const textIndexTo = _.map(body.textIndexTo, function(val){ return Number(val) });
  const pIndexTo = Number(body.pIndexTo);


  Connection.createSREF(
    idFrom,
    idTo,
    textIndexFrom,
    pIndexFrom,
    textIndexTo,
    pIndexTo,
    function(err, result){
      if (!err) {
        const parsedSREF = srefParser(result[0]);

        var object = article.toJSON();
        object.sref = sref;
        
        object.sref.push(parsedSREF);
        res.send(object);
      } else {
        res.status(400).send(utils.errsForApi(err.errors || err));
      }
  })
};

/**
 * Load
 */
exports.getReadController = function (req, res) {
  const article = req.article
  const sref = req.sref
  if (!article) {
    res.status(404).send(utils.errsForApi('Article not found!!'));
  } else if (article) {
    const object = article.toJSON();
    object.sref = sref;
    res.send(object);
  }
};

/**
 * Update
 */
exports.getUpdateController = function (req, res) {
  var article = req.article
  var key;
  for (key in req.body) {
    article[key] = req.body[key];
  }
  const images = req.files[0]
    ? [req.files[0].path]
    : [];
  article.uploadAndSave(images, function (err) {
    if (!err) {
      res.send(article);
    } else {
      res.status(400).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Delete
 */
exports.getDeleteController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(500).send(utils.errsForApi('Error loading article.'));
  } else {
    article.remove();
    article.save(function (err) {
      if (!err) {
        res.send(article);
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  }
};

/**
 * Create Comment
 */
exports.getCreateCommentController = function (req, res) {
  const article = req.article
  const user = req.user;

  if (!article) return res.status(500).send( utils.errsForApi('There was an error in your request') );
  if (!req.body.body) return res.status(422).send( utils.errsForApi('Requires a comment body'));

  article.addComment(user, req.body, function (err) {
    if (err) return res.status(500).send(errMsg(err));
    
    var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
    var comments = articleObj.comments;
    comments[comments.length-1].user=_.pick(user, ['username', '_id', 'name']); //For security we only send id and username.
    res.send(articleObj);
  });
}
  

/**
 * Delete Comment
 */
exports.getDeleteCommentController = function (req, res) {
  var article = req.article;
  var commentId = req.params.commentId;
  article.removeComment(commentId, function (err) {
    if (err) {
      res.send(utils.errsForApi('There was an error in your request'));
    }
    res.send(article);
  });
};