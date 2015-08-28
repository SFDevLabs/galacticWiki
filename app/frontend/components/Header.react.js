/**
 * @jsx Header.react
 */
"use strict";

var React = require('react');
var Link = require('react-router').Link;
var utils = require('../utils');
var userName =utils.getUserName();

var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var NavItem = require('react-bootstrap').NavItem;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;


var Header = React.createClass({

  render: function () {
    return <Navbar className="navBar" brand='' toggleNavKey={0}>
      <Nav left>
        <NavItemLink className="homeBox" to="home"></NavItemLink>
      </Nav>
      <Nav middle>
        <NavItem className = "headerSearch">

          </NavItem>
        </Nav>
      <Nav right eventKey={0}> {/* This is the eventKey referenced */}
        <NavItem eventKey={1} href='login'><img className="statusBoxProfile" title="profile" /></NavItem>
      </Nav>
    </Navbar>
  }
});
module.exports = Header;
