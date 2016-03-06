const config = require('../../config/config');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(config.neo4jdb);

const createSREFQ = [
  'MATCH (PageFrom:page {_id:{_idOne}})',
  'MATCH (PageTo:page {_id:{_idTwo}})',
  'CREATE PageFrom-[Link:sref {textIndexFrom:{_textIndexFrom}, textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->PageTo',
  'RETURN PageFrom, Link, PageTo'].join('\n');

exports.createSREF = function(idOne, idTwo, textIndexFrom, pIndexFrom, textIndexTo, pIndexTo, cb){
	db.cypher(
		{
			params: {
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

// const createNodeQ = [
//   'CREATE (Page:page {_id:{_idOne}})',
//   'RETURN PageFrom, Link, PageTo'].join('\n');

// exports.createNode = function(id, cb){
// 	db.cypher({
// 	      query: createNodeQ,
// 	      params: {
// 	          _id: id
// 	      },
// 	  }, function (err, results) {
// 	      if (err) throw err;
// 	      var result = results[0];
// 	      if (!result) {
// 	        res.send({
// 	          err:null,
// 	          message: 'No Result'
// 	        })
// 	      } else {
// 	        cb(result);
// 	      }
// 	  });
// };
