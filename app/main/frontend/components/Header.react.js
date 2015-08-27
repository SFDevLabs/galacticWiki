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


var URLSearchInput = require('../../../articles/frontend/components/URLSearchInput.react');

var loginImg;
if (utils.isLoggedIn()) {
  loginImg = "/img/eoin_profile.jpg";
} else {
  loginImg = "/img/robot.png";
}

var Header = React.createClass({

  render: function () {
    return <Navbar className="navBar" brand='' toggleNavKey={0}>
      <Nav left>
        <NavItemLink className="homeBox" to="articles"><img className="homeLogoFont" src="/img/logo_clustr_font.png"/></NavItemLink>
      </Nav>
      <Nav middle>
        <NavItem className = "headerSearch">
           <URLSearchInput
              id=""
              placeholder=""
              onSave={this._onSave}
              className="form-control queryBox"
              name="query"
            />
          </NavItem>
        </Nav>
      <Nav right eventKey={0}> {/* This is the eventKey referenced */}
        <NavItemLink eventKey={1} to='add'><img className="statusBoxAddNode" src="img/circleAddButton.png" title="add a node" /></NavItemLink>
        <NavItem eventKey={2} href='login'><img className="statusBoxProfile" title="profile" src={loginImg} /></NavItem>
      </Nav>
    </Navbar>
  }
});
module.exports = Header;
