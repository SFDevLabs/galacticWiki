/**
 * @jsx App.react
 */
"use strict";

var React = require('react');
var Header = require('./Header.react');
var Item = require('./Item.react');

var RouteHandler = require('react-router').RouteHandler;

// Execute the app
var App = React.createClass({
  render:function() {
  	var jsx = (
      <div>
        <Header/>
        <RouteHandler/>
        <Item />
      </div>
    )
    return jsx;
  }
});
module.exports = App;