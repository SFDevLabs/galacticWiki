/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Router, Route, Link, IndexRoute, browserHistory, Location } from 'react-router';

const Header = require('./Header.react');
const PageMain = require('./PageMain.react');
const Search = require('./Search.react');
const SearchResults = require('./SearchResults.react');
const NotFound = require('./NotFound.react');
const User = require('./User.react');

import createBrowserHistory from 'history/lib/createBrowserHistory';

const Main = React.createClass({
  render() {

    return (
        <div>
          <Header />
          {this.props.children}
        </div>
      );
  }
});

const Root = React.createClass({
  /**
   * @return {object}
   */
  render: function() {
    //Our React Router table
    return <div style={{height:'100%'}}>
      <Router history={browserHistory}>
        <Route path="/" component={Main} >
          <IndexRoute component={Search} />
          <Route path="search" component={SearchResults} />
          <Route path=":id" component={PageMain}/>
          <Route path="users/:id" component={User}/>
          <Route path="*" component={NotFound}  />
        </Route>
      </Router>
    </div>;
  }

});

module.exports = Root;