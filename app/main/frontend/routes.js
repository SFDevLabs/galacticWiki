// Routes for module
"use strict";

var React = require('react');
var Route = require('react-router').Route;

// declare our routes and their hierarchy
var routes = (
  <Route handler={require('./components/App.react')} location="history" strict="false">
  	<Route name="home" path="/" handler={require('../../main/frontend/components/Home.react')}/>
  </Route>
);

module.exports = routes;
