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
const Connection = require('../models/connection');

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

  Article.list(options, function (errQ, results) {
    if (errQ) return res.status(500).send(utils.errsForApi(errQ.errors || errQ));

    Article.count(options.criteria).exec(function (errCount, count) {
      var ids = _.map(results, '_id')
      Connection.getNodes(
        ids
        ,function(errConnect, graphResults) {
          if (errConnect) return res.status(500).send(utils.errsForApi(errQ.errors || errQ));

          let graphIDs = _.chain(graphResults)
            .flatMap()
            .value()
              

          Article.list({
            criteria: {_id:{$in: graphIDs}},
            lean: true
          }, function (errPopulate, graphPopulateResults) {
           if (errPopulate) return res.status(500).send(utils.errsForApi(errPopulate.errors || errPopulate));

            let newResults = _.map(results, function(result, i){
              let r = result.toJSON()
              r.connections = _.map(graphResults[i], function(graphResult){
                return _.find(graphPopulateResults, {id:graphResult});
              })
              return r;
            });

            //Make the responser
            res.send({
              results:newResults,
              isURL: isURL,
              total: count
            });
   
          });

      });//Connection
    });//Article.count
  });//Article.list
};