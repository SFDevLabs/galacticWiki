/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/UserActions');
const UserStore = require('../stores/UserStore');
const SearchStore = require('../stores/SearchStore');
const SearchInput = require('./SearchInput.react');
const parse = require('url-parse');

import { Link } from 'react-router';

import { Navbar, MenuItem, NavItem, Nav, NavDropdown} from 'react-bootstrap'; 
import { LinkContainer } from 'react-router-bootstrap'; 

const ENTER_KEY_CODE = 13;

/**
 * Retrieve the current USER data from the UserStore
 */
function getState() {
  return {
    profile: UserStore.getProfile(),
    loading: false
  };
}

const Header = React.createClass({

  contextTypes:{
    router: React.PropTypes.object.isRequired,
  },

  getInitialState:function(){
    return {
      loading: true
    };
  },

  componentDidMount: function() {
    Actions.getProfile();
    UserStore.addChangeListener(this._onChange);
    SearchStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
    SearchStore.addChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render: function() {

    const profile = this.state.profile? this.state.profile:{};
    const isLoggedIn = !!profile._id;
    const loading = this.state.loading;

    const url = parse(window.location.search, true);
    const query = url.query.q;

    const searchBar = this._activeURL('/')?null:
    <Navbar.Form pullLeft>
              <SearchInput 
                onSave={this._save}
                value={query}
                width="350px"/>
    </Navbar.Form>;

    // Create the right side based on logged in state. (Notice the react.js required unique keys placed in each item)
    var navItemsLeft = isLoggedIn?
      []
      :[];

    // Create the left side based on logged in state.
    var navItemsRight = isLoggedIn?
          <NavDropdown eventKey={2} title={profile.username} id="basic-nav-dropdown">
            <LinkContainer className={this._activeClass('/users/'+profile._id)} key={2.0} to={'/users/'+profile._id}>
              <MenuItem >Profile</MenuItem>
            </LinkContainer>
            <MenuItem eventKey={2.1} href="/logout" >Logout</MenuItem>
          </NavDropdown>:
          [<NavItem key={2} eventKey={3} href="/login">Login</NavItem>,
          <NavItem key={3} eventKey={3} href="/signup">Signup</NavItem>]
          
    const navBar = !loading?
    <Navbar.Collapse>
      <Nav>
        {navItemsLeft}
        {searchBar}
      </Nav>
      <Nav pullRight>
        {navItemsRight}
      </Nav>
    </Navbar.Collapse>:null;

    return <Navbar fluid style={{padding: "0px 15px"}} >
      <div className="container">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className="navbar-brand">Galactic</ Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {navBar}
      </div>
    </Navbar>
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (url) {
    if (url && url.length>0){
      this.context.router.push('/search?q='+url, {q:url});
    }
  },

  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState(getState());
  },

  /**
   * [_activeClass Is this link the active href]
   * @param  {string} path 
   * @return {[type]}      [description]
   */
  _activeClass: function(path){
    return this._activeURL(path)?'active':null;
  },
  /**
   * [_activeURL Is this link the active href]
   * @param  {string} path 
   * @return {[type]}      [description]
   */
  _activeURL: function(path){
    const indexOnly = true; //https://github.com/rackt/react-router/blob/master/docs/API.md#isactivepathorloc-indexonly
    return this.context.router.isActive(path, indexOnly)
  }

});

module.exports = Header;