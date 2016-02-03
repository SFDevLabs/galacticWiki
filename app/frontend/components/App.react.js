/**
 * @jsx App.react
 */
"use strict";

var React = require('react');
var Header = require('./Header.react');
var Footer = require('./Footer.react');
var colorsHex = require('../constants/colorsHex')

var RouteHandler = require('react-router').RouteHandler;

var appStyle={
	backgroundColor:colorsHex.backgroundColor,
	height: '100%'
}
// Execute the app
var App = React.createClass({
  render:function() {
  	var jsx = (
      <div style={appStyle}>
        <Header/>
        <RouteHandler/>
        <Footer/>
      </div>
    )
    return jsx;
  }
});
module.exports = App;