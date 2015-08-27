// user.js
// User model logic.
// 
var config = require('../../../config/config');
var neo4j = require('neo4j');
//var uuid = require('node-uuid');
var db = new neo4j.GraphDatabase(
    config.graphdb
);

// private constructor:

var Site = function Site(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Site.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Site.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

Site.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Site.prototype.del = function (callback) {
    // use a Cypher query to delete both this user and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:Site)',
        'WHERE ID(user) = {userId}',
        'DELETE user',
        'WITH user',
        'MATCH (user) -[rel:follows]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

Site.prototype.update = function (callback) {
    // use a Cypher query to delete both this user and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    // var query = [
    //     'MATCH (user:Site)',
    //     'WHERE ID(user) = {userId}',
    //     'SET user[key]',
    // ].join('\n')

    // var params = {
    //     userId: this.id,
    //     key: this.id
    // };

    // db.query(query, params, function (err) {
    //     callback(err);
    // });
};

Site.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

Site.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (user:Site) -[rel:follows]-> (other:Site)',
        'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// users this user follows, and others is all other users minus him/herself.
Site.prototype.getFollowingAndOthers = function (callback) {
    // query all users and whether we follow each one or not:
    var query = [
        'MATCH (user:Site), (other:Site)',
        'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
        'WHERE ID(user) = {userId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        userId: this.id,
    };

    var user = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Site(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (user.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};

// static methods:

// Site.get = function (id, callback) {
//     var query = [
//         'START USEREDGE = relationship('+id+')',
//         'RETURN USEREDGE, startNode(USEREDGE), endNode(USEREDGE)'
//     ].join('\n');

//     db.query(query, null, function (err, result) {
//         if (err) return callback(err);

        
//         callback(null, relationshipParser(result[0]));
//     });
// };

Site.findByURL = function (url, callback) {
    var query = [
        'MATCH (siteFrom:Site)',
        'WHERE siteFrom.url = {url}',
        'RETURN siteFrom'
    ].join('\n');

    db.query(query, {url:url}, function (err, results) {
        if (err) return callback(err);
        var parsedQueryResult = [];
        
        results.forEach(function (result) {
            var data = result['siteFrom']._data.data;
            data.id = result['siteFrom']._data.metadata.id;
            parsedQueryResult.push(data)
        });

        callback(null, {
            length: parsedQueryResult.length,
            data:parsedQueryResult
        });
        
    });
};


Site.get = function (id, callback) {
    var query = [
        'START siteFrom = node('+id+')',
        'MATCH siteFrom -[USEREDGE:USEREDGE]-(siteTo:Site)',
        'RETURN USEREDGE, siteTo, siteFrom'
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);

        var parsedSitesResult = [];
        results.forEach(function (result) {

            var data = result['siteFrom']._data.data;
            data.id = result['siteFrom']._data.metadata.id;
        
            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }

            var data = result['siteTo']._data.data;
            data.id = result['siteTo']._data.metadata.id;
            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }
        });
        
        var parsedEdgeResult = results.map(function (result) {

            var item = {};

            item = result['USEREDGE']._data.data;
            item.id=result['USEREDGE']._data.metadata.id;

            item.siteToId = result['siteTo']._data.metadata.id;
            item.siteFromId = result['siteFrom']._data.metadata.id;

            return item
        }); 


        callback(null, {
            Sites: parsedSitesResult,
            USEREDGE: parsedEdgeResult
        });
        
    });
};


function relationshipParser(result){
    var item = {};
    item['siteFrom']=result['startNode(USEREDGE)']._data.data;
    item['siteFrom'].id=result['startNode(USEREDGE)']._data.metadata.id;
    item['siteTo'] = result['endNode(USEREDGE)']._data.data;
    item['siteTo'].id = result['endNode(USEREDGE)']._data.metadata.id;
    item['USEREDGE'] = result['USEREDGE']._data.data;
    item['USEREDGE'].id = result['USEREDGE']._data.metadata.id;
    return item;
};

function itemParser(result){
    var item = {};
    item['siteTo']=result['siteTo']._data.data
    item['siteTo'].id=result['siteTo']._data.metadata.id;
    item['USEREDGE']=result['USEREDGE']._data.data
    item['USEREDGE'].id=result['USEREDGE']._data.metadata.id;

    item['USEREDGE'].siteTo=result['siteTo']._data.metadata.id;
    item['USEREDGE'].siteFrom=result['siteFrom']._data.metadata.id;

    return item;
};


        
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function edgesConnected(_edges, id){
    _edges.filter(function(obj){
      return obj.siteFromId === record.id || obj.siteToId === record.id;
    });
};
        
Site.getAll = function (q ,callback) {
    //Why?  We need and empty extensible query object;
    var query = [
    ];

    query.push('MATCH (siteFrom)-[USEREDGE:USEREDGE]->(siteTo)');//basic user queary
    
    // At some point the graph will grow to large for universal queries but for now this will work.
    // if( q.userID ){ //Filter by userid if we have one from the request
    //     query.push('WHERE USEREDGE.userId = {userID}')        
    // };

    query.push('RETURN USEREDGE, siteFrom, siteTo'); //Defined the return objects
    
    query =query.join('\n');

    db.query(query, q, function (err, results) {
        if (err) return callback(err);

        /*
            Horible Hacky logic and duplicated code.  This is intended to be rapidly changed as we extend the extent of graph queary and how to post proccess the result.
         */
        var parsedEdgeResult = results.map(function (result) { // We need to build an edge list for the api

            var item = {};
            item = result['USEREDGE']._data.data;
            item.id=result['USEREDGE']._data.metadata.id;

            item.siteToId = result['siteTo']._data.metadata.id;
            item.siteFromId = result['siteFrom']._data.metadata.id;

            return item
        });

        var parsedSitesResult = [];
        results.forEach(function (result) { // We need to build a list of nodes for each request.

            var data = result['siteFrom']._data.data;
            data.id = result['siteFrom']._data.metadata.id;
            data.connectionCount = parsedEdgeResult.filter(function(edge){// Counting connections.  Not dry
                return data.id===edge.siteToId || data.id===edge.siteFromId;
            }).length;

            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }

            var data = result['siteTo']._data.data;
            data.id = result['siteTo']._data.metadata.id;
            data.connectionCount = parsedEdgeResult.filter(function(edge){// Counting connections.  Not dry
                return data.id===edge.siteToId || data.id===edge.siteFromId;
            }).length;

            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }
        });
        /*
            End of the horror. The horror
         */

        callback(null, {
            Sites: parsedSitesResult,
            USEREDGE: parsedEdgeResult
        });
    });
};


// creates the user and persists (saves) it to the db, incl. indexing it:
Site.createConnection = function (nodeOne, nodeTwo, edge, callback) {

    var query = [];

    if (nodeOne.id){
        query.push('MATCH siteFrom where id(siteFrom) = {nodeOneID}');
    } else {
        query.push('CREATE (siteFrom:Site {nodeOne}) WITH siteFrom');
    }
    
    if (nodeTwo.id){
        query.push('MATCH siteTo where id(siteTo) = {nodeTwoID}');
    } else{
        query.push('CREATE (siteTo:Site {nodeTwo})');
    }
    // an example using an object instead of an array


    // query.push('MERGE (siteOne:Site {url: {nodeOne}.url, title: {nodeOne}.title })');
    // query.push('MERGE (siteTwo:Site {url: {nodeTwo}.url, title: {nodeTwo}.title })');
    query.push('CREATE (siteFrom)-[USEREDGE:USEREDGE{edge}]->(siteTo)');
    query.push('RETURN USEREDGE, siteTo, siteFrom');
    
    query = query.join('\n');    

    var params = {
        nodeOne: nodeOne,
        nodeTwo: nodeTwo,
        edge: edge,
        nodeOneID:Number(nodeOne.id),
        nodeTwoID:Number(nodeTwo.id)
    };


    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        //var user = new Site(results[0]['user']);
        //
        var parsedSitesResult = [];
        results.forEach(function (result) {

            var data = result['siteFrom']._data.data;
            data.id = result['siteFrom']._data.metadata.id;
        
            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }

            var data = result['siteTo']._data.data;
            data.id = result['siteTo']._data.metadata.id;
            if ( arrayObjectIndexOf(parsedSitesResult, data.id, "id")==-1 ){
                parsedSitesResult.push(data)
            }
        });
        
        var parsedEdgeResult = results.map(function (result) {

            var item = {};

            item = result['USEREDGE']._data.data;
            item.id=result['USEREDGE']._data.metadata.id;

            item.siteToId = result['siteTo']._data.metadata.id;
            item.siteFromId = result['siteFrom']._data.metadata.id;

            return item
        }); 

        callback(null, {
            Sites: parsedSitesResult,
            USEREDGE: parsedEdgeResult
        });

    });
};

module.exports = Site;