'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const Article = mongoose.model('Article');
const _ = require('lodash');
const utils = require('../../lib/utils');
const validator = require('validator');

/**
 * List
 */

exports.getListController = function (req, res) {


  //res.json({stuff:true})
  var skip = Number(req.query.skip)
  var count = Number(req.query.count)
  const q = req.query.q
  const criteria = q?{title:q}:null;
  
  skip =  !isNaN(skip) ? skip : 0;
  count =  !isNaN(count) ? count : 30;
  
  var options = {
    count: count,
    skip: skip,
  };

  if (criteria){
    options.criteria = criteria
  }
  //here is where we do the logic for loading an article or searching by title.
  console.log(q)
  console.log(validator.isURL(q));

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