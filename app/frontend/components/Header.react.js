/**
 * @jsx Header.react
 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;
var utils = require('../utils');
var userName =utils.getUserName();

var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem

var Header = React.createClass({
  render: function () {
    var navbarHtml = '';
      if (true) {
        navbarHtml = (
          <Nav navbar right >
            <NavDropdown id="main-nav-dropdown" eventKey={1} title={userName} >
              <MenuItem eventKey={2} href='logout'>Logout</MenuItem>
            </NavDropdown>
          </Nav>
        );
      } else {
        navbarHtml = (
          <Nav navbar right >
            <NavItem eventKey={1} href='login'>Login</NavItem>
          </Nav>
        );
      }

    var jsx = (
      <Navbar brand={<Link to="home">Galactic</Link>} toggleNavKey={0}>
        <CollapsibleNav eventKey={0}>
          {navbarHtml}
        </CollapsibleNav>
      </Navbar>
    );
    return jsx;
  }
});
module.exports = Header;
