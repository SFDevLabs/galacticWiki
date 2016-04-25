
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchActions = require('../actions/SearchActions');
const SearchItem = require('./SearchItem.react');
import { Link } from 'react-router';

const SearchStore = require('../stores/SearchStore');
const _ = require('lodash');
const _initalSkip = 0;
const _count = 20;

///Move Mee to another file
const getState = function() {
  return {
    results: SearchStore.getAll(),
    url: SearchStore.getURL()
  }
}

const fetch = function(q, skip, clearData) {
   SearchActions.getList(_count, skip, q, clearData);
}

const SearchResults = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  propTypes:{
    q: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
    const q = this.props.q;
    const clearData = true;
    fetch(q, _initalSkip, clearData)
  },

  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(newProps){
    const q = newProps.q;
    const clearData = true;
    fetch(q, _initalSkip, clearData)
  },

  render :function() {
    const resultsData = this.state.results;
    const isURL = this.state.url;

    const length = Object.keys(resultsData).length;
    const createURL = isURL?
      (<span>But you can <Link to={"/new?site="+this.state.url} >add this site to Galactic.</Link></span>):
      null;

    const results = length>0?_.map(resultsData, function(result, i) {
        return <SearchItem key={i} item={result} />
    }):
    <div clasName="row">
      No Results Found. {createURL}
    </div>;

    return <div className="row">
      {results}        
    </div>
  },

  /**
   * Event handler for 'change' events coming from the SearchStore
   */
  _onChange: function() {
    this.setState(getState())
  }

})

module.exports = SearchResults;