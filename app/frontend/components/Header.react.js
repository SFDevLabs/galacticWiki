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
var NavItem = require('react-bootstrap').NavItem;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;


var Header = React.createClass({

  render: function () {

    var navbarHtml = '';
      if (true) {
        navbarHtml = (
         <Nav navbar right >
              <NavItem eventKey={2} href='login'>Login</NavItem>
              <NavItem eventKey={3} href='logout'>Logout</NavItem>
          </Nav>
        );
      } else {

      }

    var jsx = (
      <Navbar brand={<Link to="home">React-Bootstrap</Link>} toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          {navbarHtml}
        </CollapsibleNav>
      </Navbar>
    );
    return jsx;
  }
});
module.exports = Header;
