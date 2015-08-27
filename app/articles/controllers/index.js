
// /**
//  * Module dependencies.
//  */

 var mongoose = require('mongoose');
 var Article = mongoose.model('Articles');
 var User = mongoose.model('User');
 var utils = require('../../../lib/utils');
 var GraphModel = require('../models/graph');
 var URLParse = utils.URLParse

var config = require('../../../config/config');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(config.alchemyAPIKey);
var async = require('async');


exports.urlsearch = function (req, res){
  var url = URLParse(req.param('url'));
  
  if (!url) return res.send(utils.errMsg('No Valid URL to Query.'))

  GraphModel.findByURL(url ,function(err, results){
      if (err){ return console.log(err, 'err') }
      
      if (results.data.length===0 && urlValidate(url)){
        GetTitleResult(url, function(err, result){
          res.send({length:0,data:[], newItem:result});
        })
      }else{
        res.send(results);
      }
  
  });
    
};


function GetTitleResult(url, cb){

  if (!url) return {error: "No URL in Request"}
  var url = URLParse(url);
  alchemy.title('http://'+url,{},function(err, response){
            var parseSuccess = response.status==='OK'
            if (err){
              cb(null,{error: "Server Failure"})
            } else if (parseSuccess){
              cb(null, {
                url: url,
                title: response.title,
                success: parseSuccess
              })
            }else{
              cb(null, null)
            } 
            
    });
}

/**
 * List
 */
exports.getAll = function (req, res){
  //var userName = req.param('userName');
  //
  var q={};
  if (req.profile){ q.userID=req.profile.id };
  
  GraphModel.getAll(q, function(err, results){
    if(err){
      return res.status(500).send(err.toString())
    };
    populateEdgeWithUsers(results, function(err, resultspopulated){
      res.send(resultspopulated);
    });
    
  });
}

/**
 * Load
 */

exports.load = function (req, res, next){  
  var username = req.param('userName');
  var options={criteria:null};
  console.log(username,'username');
  if (username){
    options.criteria={username:username};
    User.load(options, function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('not found'));
      req.profile = user;
      next();
    });
  }else{
    next();
  }

};

function populateEdgeWithUsers(results, cb){
      
    var userIds = results.USEREDGE.map(function(obj){
      return obj.userId?obj.userId:null;
    });
    User.edgePopulate(userIds, function(err, userlist){

      results.USEREDGE = results.USEREDGE.map(function(obj){
        var val = {}
        userlist.every(function(userObj){ 
          if (userObj.id === obj.userId){
            val = obj
            val.user=userObj.toJSON();
            delete val.user._id
            return false
          }else{
            return true
          }
        })
        return val;
      })
      
      cb(null, results) 
    })
}

var mongoose = require('mongoose');
var User = mongoose.model('User');




/**
 * Create
 */
exports.create = function (req, res){
  var urlOne = URLParse(req.body.urlOne);
  var urlTwo = URLParse(req.body.urlTwo);
  var titleOne = URLParse(req.body.titleOne);
  var titleTwo = URLParse(req.body.titleTwo);
  var idOne = URLParse(req.body.idOne);
  var idTwo = URLParse(req.body.idTwo);

  var userId = req.user.id;

  if (!urlOne || !urlOne){return res.status(204).send(utils.errMsg('Requires Two Valid URLs.'))};
      
      var nodeOne = {
        url: urlOne,
        title: titleOne,
        id: idOne
      };

      var nodeTwo = {
        url: urlTwo,
        title: titleTwo,
        id: idTwo
      };

      GraphModel.createConnection(nodeOne,nodeTwo,{userId:userId},
        function(err, result){
          if (err) {
            return res.status(500).send(err)
          }
          res.send(result);
      });


  // async.series([
  //     function(callback){
  //         alchemy.title('http://'+urlOne,{},function(err, response){
  //           console.log(err, response)
  //             callback(null, response.title);
  //         })
  //         callback(null, 'gg');
  //     },
  //     function(callback){
  //       setTimeout(function(){
  //           callback(null, null);
  //       }, 500);
  //     },
  //     function(callback){
  //         alchemy.title('http://'+urlTwo,{},function(err, response){
  //           console.log(err, response)
  //             callback(null, response.title);
  //         })
  // }],
  // function(err, results) {

  // });

  
}

/**
 * Get
 */
exports.get = function (req, res){
  var id = Number(req.param('uid'));
  GraphModel.get(id, function(err, result){
    if(err){return res.status(404).send(err); }
    populateEdgeWithUsers(result, function(err, resultspopulated){
      res.send(resultspopulated);
    })
  });
}


/**
 * Get
 */
exports.async = function (req, res){
  urlOne = 'www.nytimes.com/2015/06/11/nytnow/your-thursday-evening-briefing.html?hp&action=click&pgtype=Homepage&module=second-column-region&region=top-news&WT.nav=top-news&gwh=CC476901993BC25810459351038641F3&gwt=pay'
  urlTwo =  'hwww.nytimes.com/2015/06/12/technology/dick-costolo-twitter-ceo-jack-dorsey.html?hp&action=click&pgtype=Homepage&module=first-column-region&region=top-news&WT.nav=top-news'
  async.series([
      function(callback){
          alchemy.title('http://'+urlOne,{},function(err, response){
            var title
            if (!err){
              title = response.title
            }else{
              title = null;
            } 
            callback(err, title);
          });
      },
      function(callback){
          alchemy.title('http://'+urlTwo,{},function(err, response){
            var title
            if (err || response.status=='ERROR'){
              title = response.title
            }else{
              title = null;
            }
            callback("errortrue", title);
          });
  }],
  function(err, results) {
    res.send({err:err,results:results});  
  });

}

