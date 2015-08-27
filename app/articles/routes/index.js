
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)
var mongoose = require('mongoose')
var crudUtils = require('../../../lib/crudUtils');
var crudUtilsGraph = require('../../../lib/crudUtilsGraph');
var ArticlesModel = mongoose.model('Articles');

var main = require('../../main/controllers/index');
var articles = require('../controllers/index');
var auth = require('../../../config/middlewares/authorization');

/**
 * Expose routes
 */

module.exports = function (app, passport, auth) {

  /**
   * Route main middlewares
   */
  app.get('/', main.index);
  app.get('/add', main.index);

  /**
   * Route in local middlewares
   */
  app.get('/apigraph/query', articles.urlsearch);

  // Holder logic for working with uniqu links per route
  //

  /**
   * Crud Operations With User Auth
   */
  //app.param('uid', articles.load);

  var graphURL= '/apigraph/articles';
  app.get(graphURL+"/:uid", articles.get);
  app.get(graphURL, articles.load, articles.getAll);
  app.post(graphURL, articles.create);


  crudUtils.initRoutesForModel(app, ArticlesModel, auth, 'id', '/api/articles');

  //Register Catch all after Crud
  app.get('/:id', main.index);

}
