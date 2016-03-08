
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchActions = require('../actions/SearchActions');
const ArticleActions = require('../actions/ArticleActions');
const SearchItem = require('./SearchItem.react');

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
    const data = this.state.results;
    const length = Object.keys(data).length;

    const create =  <input className='btn btn-default' onClick={this._onPost} value={this.state.url} /> ;

    const results = length>0?_.map(data, function(result, i) {
        return <SearchItem key={i} item={result} />
    }):
    <div clasName="row">
      No Results Found.
    </div>;

    return <div className="row">
      {results}        
      {create}
    </div>
  },

  /**
   * Event handler for 'change' events coming from the SearchStore
   */
  _onChange: function() {
    this.setState(getState())
  },

  /**
   * Event handler for 'save' events coming from the SearchStore
   */
  _onPost: function(){
    ArticleActions.create(this.state.url);
  }

})

module.exports = SearchResults;