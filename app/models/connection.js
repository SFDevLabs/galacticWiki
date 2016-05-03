'use strict';

/**
 * Module dependencies.
 */

const config = require('../../config/config');
const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase(config.neo4jdb);
const _ = require('lodash');


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
	  }, function(err, results){

	  	if (err) {
	  	  console.log(err, 'getNode')
	  		return cb(err, null)
	  	}

      cb(err,
				_.chain(results)
		  	 .filter(function(r, i){
		  			console.log(r.PageOne._id, 'r')

		  	 	return r.Link._fromId === r.PageOne._id})
		  	 .map(function(r){return srefParser(r)})
	       .value(),
				_.chain(results)
		  	 .filter(function(r, i){return r.Link._toId === r.PageOne._id})
		  	 .map(function(r){return inboundSrefParser(r)})
	       .value()
       )
	  });
};

//get Node Query
const getNodeQ = [
  'MATCH (PageOne:page {_id:{_id}})-[Link]-(PageTwo)',
  'RETURN PageOne, Link, PageTwo'].join('\n');

/**
 * @name   srefParser
 * @r     {obj} Neo4j object
 * @return {obj}    cb  a callback for the data.
 */
const srefParser = function(r){
  const pageID = r.PageTwo.properties._id; //Get the other articles uid
  const link = r.Link.properties; //Get the link properties
  const textIndex = link.textIndexFrom;//Get the text index
  const paragraphIndex = link.pIndexFrom; //Get the p index
  return {
    _id: link._id,
    index: textIndex,
    paragraphIndex: paragraphIndex,
    sref: pageID,
  }
}

/**
 * @name   inboundSrefParser
 * @r     {obj} Neo4j object
 * @return {obj}    cb  a callback for the data.
 */
const inboundSrefParser = function(r){
  const pageID = r.PageTwo.properties._id; //Get the other articles uid
  const link = r.Link.properties; //Get the link properties
  const textIndex = link.textIndexTo;//Get the text index
  const paragraphIndex = link.pIndexTo; //Get the p index
  return {
    _id: link._id,
    index: textIndex,
    paragraphIndex: paragraphIndex,
    sref: pageID,
  }
}

  // const textIndex = outBound?link.textIndexFrom:link.textIndexTo; //Get the text index
  // const paragraphIndex = outBound?link.pIndexFrom:link.pIndexTo; //Get the p index

/**
 * load a multiple nodes from a MongoId;
 */
// exports.getNodes = function(nothing, cb){


// 	//get Node Query

// 	var ids = ['571d9c86f2bdef202cbe7e5f', '571d9cbbf2bdef202cbe7e6a']

// 	var params = {};
// 	var getMultipleNodesQ = []
// 	var returnString  = 'RETURN ';

// 	_.each(ids, function(val, i){
// 		const pageOne = 'pageOne'+String(i)
// 		const link = 'Link'+String(i)
// 		const pageTwo = 'PageTwo'+String(i)
// 		getMultipleNodesQ.push('MATCH ('+pageOne+':page {_id:{'+String(i)+'}})-['+link+']-('+pageTwo+')');

// 		if (i>0){ 
// 			returnString +=', '
// 		}
// 		returnString += (link)
// 		params[i]= val;
// 	})


// 	getMultipleNodesQ.push(returnString)
// 	getMultipleNodesQ = getMultipleNodesQ.join('\n');

// 	console.log(getMultipleNodesQ)


// 	db.cypher({
// 	      query: getMultipleNodesQ,
// 	      params: params,
// 	  },
// 	  cb);
// };


/**
 * load a multiple nodes from a MongoId;
 */
exports.getNodes = function(ids, cb){


	const getMultipleNodesQ = ['MATCH (pageOne)-[Link]->(pageTwo)',
		'WHERE pageOne._id IN {_id}',
		'RETURN pageOne, pageTwo, Link'].join('\n');

	// getMultipleNodesQ.push(returnString)
	// getMultipleNodesQ = getMultipleNodesQ.join('\n');


	db.cypher({
	      query: getMultipleNodesQ,
	      params: {
	      	_id:ids
	      },
	  },
	  function(err, results){

	  	if (err) {
	  	  console.log(err)
	  		return cb(err, null)
	  	}

      cb(err,
		  	_.map(ids, function(id){
		  		return _.chain(results) 
		  		.filter(function(r){ 
		  			return id == r.pageOne.properties._id ||
		  			 id == r.pageTwo.properties._id
		  		})
		  		.map(function(r){
		  			return resultsParser(r, id)
		  		})
		  		.uniq()
		  		.value()
		  	})
       )
	  });
};


/**
 * @name   srefParser
 * @r     {obj} Neo4j object
 * @return {obj}    cb  a callback for the data.
 */
const resultsParser = function(r, id){
	const pageID = r.pageOne.properties._id != id ? r.pageOne.properties._id :r.pageTwo.properties._id;
  return pageID
}
