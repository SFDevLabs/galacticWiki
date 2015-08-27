/**
 * @jsx App.react
 */
"use strict";

var React = require('react');
var Header = require('./Header.react');
var RouteHandler = require('react-router').RouteHandler;

// Execute the app
var App = React.createClass({
  render:function() {
    return (
      <div>
        <Header/>
        <RouteHandler/>
      </div>
    )
  }
});
module.exports = App;