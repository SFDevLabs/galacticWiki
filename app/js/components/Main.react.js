/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

const Header = require('./Header.react');
const Articles = require('./Articles.react');
const Article = require('./Article.react');
const Search = require('./Search.react');
const SearchResults = require('./SearchResults.react');
const PostNew = require('./PostNew.react');
const PostUpdate = require('./PostUpdate.react');
const NotFound = require('./NotFound.react');
const User = require('./User.react');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');

import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();

const Main = React.createClass({
  render() {
    //route={'/'}
    return (
        <div>
          <Header route={{}} />
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
          <Route path="articles" component={Articles} />
          <Route path="tags/:tag" component={Articles} />
          <Route path="articles/new" component={PostNew} />
          <Route path="articles/:id" component={Article}/>
          <Route path="articles/:id/edit" component={PostUpdate}/>
          <Route path="users/:id" component={User}/>
          <Route path="*" component={NotFound}  />
        </Route>
      </Router>
    </div>;
  }

});

module.exports = Root;