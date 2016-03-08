
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchActions = require('../actions/SearchActions');
const PageSearchItem = require('./PageSearchItem.react');

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
//Fetch search results
const fetch = function(q, skip, clearData) {
   SearchActions.getList(_count, skip, q, clearData);
}

const PageSearchResults = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  propTypes:{
    q: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(newProps){
    const q = newProps.q;
    const clearData = true;
    if ( q !== this.props.q ){ //This makes a fetch only when we input a new prop.
      fetch(q, _initalSkip, clearData);
    }
  },

  render :function() {
    const that = this;
    const data = this.state.results;
    const length = Object.keys(data).length;

    const results = length>0?_.map(data, function(result, i) {
      return <PageSearchItem 
        key={i}
        item={result}
        onSelect={that.props.onSelect} />
    }):
    <div>
      No Results Found.
    </div>;

    return <div className="row" >
      {results}        
    </div>
  },

  /**
   * Event handler for 'change' events coming from the SearchStore
   */
  _onChange: function() {
    this.setState(getState())
  },

})

module.exports = PageSearchResults;