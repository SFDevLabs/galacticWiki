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
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;



var Header = React.createClass({

  render: function () {
    var jsx = (
    <Navbar brand={<Link to="home">React-Bootstrap</Link>} toggleNavKey={0}>
      <CollapsibleNav eventKey={0}>
        <Nav right eventKey={1}>
          <NavItem eventKey={2} href='login'>Login</NavItem>
        </Nav>
      </CollapsibleNav>
    </Navbar>);
    return jsx;
  }
});
module.exports = Header;
