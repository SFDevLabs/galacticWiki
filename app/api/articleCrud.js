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
const pageRequester = extract.pageRequester;
const URLParse =extract.URLParse
const URL = require('url-parse');
const async = require('async');


/**
 * Load
 */

exports.load = function (req, res, next, id){
  Article.load(id, function (err, article) {
    if (!article || (err && err.message==='Cast to ObjectId failed')) return  res.status(404).send(utils.errsForApi('Article not found'));
    if (err) return  res.status(500).send( utils.errsForApi(err.errors || err) );
    req.article = article;
    next();
  });
};

/**
 * Load comment
 */

exports.loadComment = function (req, res, next, id) {
  const article = req.article;
  utils.findByParam(article.comments, { id: id }, function (err, comment) {
    if (err) return next(err);
    req.comment = comment;
    next();
  });
};

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
      pageRequester,
  ], function(err, result){
      console.log(err, result, 'end')
      if (err){
        const status = err.status || 500;
        res.status(err.status).send({errors:utils.errsForApi(err.errors || err)});
      } else {
        var article = new Article(result);
        article.save(function(err){
          if(err)res.status(500).send({errors:utils.errsForApi(err.errors || err)});
          res.send(article);
        });
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
  console.log(url,3)
  Article
    .findOne({'$or':[{ canonicalLink: url }, { queryLink: url }]})
    .exec(function(err, result){
        if (err){
          cb(err)
        } else if (result!==null) {
          cb(null, result);
        } else {
          cb(null, url);
        }
    });
}

/**
/ End page Loader helpers
*/

/**
 * Load
 */
exports.getReadController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(404).send(utils.errsForApi('Article not found!!'));
  } else if (article) {
    res.send(article);
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