const config = require('../../config/config')
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(config.neo4jdb);


exports.db = db;