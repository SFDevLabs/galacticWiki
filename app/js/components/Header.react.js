/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/UserActions');
const UserStore = require('../stores/UserStore');
const SearchStore = require('../stores/SearchStore');

import { Link } from 'react-router';

import { Navbar, MenuItem, NavItem, Nav, NavDropdown} from 'react-bootstrap'; 
import { LinkContainer } from 'react-router-bootstrap'; 

const inputCSS= {width:'350px'};
const ENTER_KEY_CODE = 13;

/**
 * Retrieve the current USER data from the UserStore
 */
function getState() {
  return {
    query: SearchStore.getQuery(),
    profile: UserStore.getProfile(),
    loading: false
  };
}

const Header = React.createClass({
  contextTypes:{
    router: React.PropTypes.object.isRequired
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
    const query = this.state.query?this.state.query:'';

    const searchBar = this._activeURL('/')?null:
    <Navbar.Form pullLeft>
      <span className="input-group">
        <input 
          value={query} 
          style={inputCSS}type="text" 
          className="form-control"
          onKeyDown = {this._keyDown}
          onChange={this._onChangeInput} />
        <span className="input-group-btn">
          <button onClick={this._save} className="btn btn-default">
            <span className="glyphicon glyphicon-search"></span>
          </button>
        </span>
      </span>
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
   * @name   On Keydown Callback
   * @desc   Calls a debounced function
   */
  _keyDown: function (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  },

  /**
   * @name   On Change Callback
   * @desc   Calls a debounced function
   */
  _onChangeInput: function (event) {
    const val = event.target.value
    this.setState({query:val})
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (event) {
    const val = this.state.query
    if (val && val.length>0){
      this.context.router.push('/search?q='+val);
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
