/**
 * @jsx Index
 */
"use strict";

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;

//Import the modules of the different app components
var MainRoutes = require('./routes');
//Other Routers
var ArticleRoutes = require('../../articles/frontend/routes');
//remove all trailing slash
window.history.pushState({}, '', window.location.pathname.replace(/(\/)+$/,"")+window.location.search+window.location.hash)

//This is where we pass in our frontend routes files that structure the applicaiton.
Router.run([ArticleRoutes, MainRoutes], Router.HistoryLocation, function(Root){
  React.render(<Root/>, document.getElementById('app'));
});