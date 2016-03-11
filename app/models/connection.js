'use strict';

/**
 * Module dependencies.
 */

const config = require('../../config/config');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(config.neo4jdb);


const mongoose = require('mongoose');
mongoose.model('Connection', {});
const Connection = mongoose.model('Connection');

/**
 * Create anSREF from two existing nodes;
 */
exports.createSREF = function(idOne, idTwo, textIndexFrom, pIndexFrom, textIndexTo, pIndexTo, cb){
	const id = new Connection({})._id;
	db.cypher(
		{
			params: {
					_id: id,
				  _idOne: idOne,
				  _idTwo: idTwo,
				  _textIndexFrom: textIndexFrom,
				  _pIndexFrom: pIndexFrom,
				  _textIndexTo: textIndexTo,
				  _pIndexTo: pIndexTo
			},
			query: createSREFQ
		},
	cb
	);
};
//createSREF Query
const createSREFQ = [
  'MATCH (PageOne:page {_id:{_idOne}})',
  'MATCH (PageTwo:page {_id:{_idTwo}})',
  'CREATE PageOne-[Link:sref {_id:{_id}, textIndexFrom:{_textIndexFrom}, textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->PageTwo',
  'RETURN PageOne, Link, PageTwo'].join('\n');


// const createHREFQ = [
//   'CREATE (Page:page {_id:{_idOne}})',
//   'CREATE (Page:page {_id:{_idOne}})',
//   'CREATE PageFrom-[Link:href]->PageTo',
//   'RETURN PageFrom, Link, PageTo'].join('\n');

// exports.createHREF = function(idOne, idTwo, cb){
// 	if ([idOne, idTwo].indexOf(undefined)){ return console.log('Required Param is Undfined') }
// 	db.cypher({
// 	      params: {
// 	          _idOne: idOne,
// 	          _idTwo: idTwo
// 	      },
// 	      query: createHREFQ
// 	  }, 
// 	  function (err, results) {
// 	      if (err) throw err;
// 	      var result = results[0];
// 	      if (!result) {
// 	        res.send({
// 	          err:null,
// 	          message: 'No Result'
// 	        })
// 	      } else {
// 	      	cb(result);
// 	      }
// 	  });
// };


/**
 * Create a node from a MongoId;
 */
exports.createNode = function(id, cb){
	db.cypher({
	      query: createNodeQ,
	      params: {
	          _id: id
	      },
	  },
	  cb);
};
//createNode Query
const createNodeQ = [
  'CREATE (Page:page {_id:{_id}})',
  'RETURN Page'].join('\n');


/**
 * load a node from a MongoId;
 */
exports.getNode = function(id, cb){
	db.cypher({
	      query: getNodeQ,
	      params: {
	          _id: id
	      },
	  },
	  cb);
};
//  'MATCH (PageTo:page {_id:{_id}})-[Link]->(PageFrom)',

//get Node Query
const getNodeQ = [
  'MATCH (PageOne:page {_id:{_id}})-[Link]-(PageTwo)',
  'RETURN PageOne, Link, PageTwo'].join('\n');
