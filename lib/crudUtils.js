/**
 * Very basic CRUD route creation utility for models.
 * For validation, simply override the model's save method.
 */

(function (exports) {

  "use strict";

  var errMsg = require('./utils').errMsg;

  //------------------------------
  // List
  //
  function getListController(model) {
    return function (req, res) {
      //console.log('list', req.body);
      model.find({}).populate('user').exec(function (err, result) {
        if (!err) {
          res.send(result);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Create
  //
  function getCreateController(model) {
    return function (req, res) {
      //console.log('create', req.body);
      var m = new model(req.body);
      m.user = req.user;
      m.save(function (err) {
        if (!err) {
          res.send(m);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Read
  //
  function getReadController(model) {
    return function (req, res) {      
      res.send(req.article);
    };
  }

  //------------------------------
  // Update
  //
  function getUpdateController(model) {
    return function (req, res) {
      //console.log('update', req.body);
      model.findById(req.params.id, function (err, result) {
        if (!result.user || result.user!=req.user.id){ // running user auth
            res.status(401).send({'error': {'message': 'Not Authorized'}});        
        } else {
          var key;
          for (key in req.body) {
            result[key] = req.body[key];
          }
          result.save(function (err) {
            if (!err) {
              res.send(result);
            } else {
              res.send(errMsg(err));
            }
          });      
        }//if else end
      });
    };
  }

  //------------------------------
  // Delete
  //
  function getDeleteController(model) {
    return function (req, res) {
      //console.log('delete', req.body);
      //
      req.article.remove();
      result.save(function (err) {
            if (!err) {
              res.send({});
            } else {
              res.send(errMsg(err));
            }
          });
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(errMsg(err));
        } else if (!result.user || result.user!=req.user.id){ //We check to make sure the user is the creator
          res.status(401).send({'error': {'message': 'Not Authorized'}});
        } else {
          result.remove();
          result.save(function (err) {
            if (!err) {
              res.send({});
            } else {
              res.send(errMsg(err));
            }
          });
        }
      });
    };
  }

  exports.initRoutesForModel = function (app, model, auth, loadUI, path) {

    if (!app || !model) {
      console.log('No app or model not starting crud api')
      return false;
    }

    if (!path){path="/"};
    var pathWithId = path + '/:'+loadUI;

    //var m=model
    app.get(path, getListController(model));
    app.post(path, auth.requiresLoginAPI, getCreateController(model));
    app.get(pathWithId, getReadController(model));
    app.put(pathWithId, auth.requiresLoginAPI, getUpdateController(model));
    app.delete(pathWithId, auth.requiresLoginAPI, getDeleteController(model));
  };

}(exports));