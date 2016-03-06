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

  var skip = Number(req.query.skip)
  var count = Number(req.query.count)
  const q = req.query.q
  const isURL =validator.isURL(q);

  var options = {
    count: count,
    skip: skip,
  };

  if(isURL){
    options.criteria = {canonicalLink:q};
  } else {
    options.criteria = {title: new RegExp(q, 'i') };
  }

  Article.list(options, function (err, results) {
    Article.count(options.criteria).exec(function (errCount, count) {

      //here is where we consult the graph URL.
      if (!err) {
        res.send({
          results:results,
          isURL: isURL,
          total: count
        });
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  });

};