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

  Article.list(options, function (err, results) {


    Article.count(options.criteria).exec(function (errCount, count) {
      var ids = _.map(results, '_id')
      Connection.getNodes(
        ids
        , function(err, graphResults) {

          

        let graphIDs = _.chain(graphResults)
          .flatMap()
          .value()
            

        Article.list({
          criteria: {_id:{$in: graphIDs}},
          lean: true
        }, function (err, graphPopulateResults) {

          let newResults = _.map(results, function(result, i){
            let r = result.toJSON()
            r.connections = _.map(graphResults[i], function(graphResult){
 
              // console.log(typeof graphPopulateResults[0].id)
              // console.log(_.find(graphPopulateResults, {id:graphResult}))

              return _.find(graphPopulateResults, {id:graphResult});
            })
            return r;
          });

         if (!err) {
            res.send({
              results:newResults,
              isURL: isURL,
              total: count
            });
          } else {
            res.status(500).send(utils.errsForApi(err.errors || err));
          }    
         
          
        });


      });//Connection
    });//Article.count
  });//Article.list
};