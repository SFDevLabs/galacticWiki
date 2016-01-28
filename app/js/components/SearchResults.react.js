
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchActions = require('../actions/SearchActions');
const ArticleActions = require('../actions/ArticleActions');
const ArticleItem = require('./ArticleItem.react');

const SearchStore = require('../stores/SearchStore');
const _ = require('lodash');
const initalSkip = 0;
const count = 20;

const searchHeader = {
  borderBottom:'none'
}

const searchRow = {
  paddingTop:'25px'
}

const searchButton = {
  marginRight:'30px',
  padding: '8px 20px',
  fontSize: '1.1em'
}
///Move Mee to another file
const getState = function() {
  return {
    results: SearchStore.getAll(),
    url: SearchStore.getURL()
  }
}

const About = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return getState();
  },

  componentWillMount: function() {
    const q = this.props.location.query.q;
    const clearData = true;
    this._fetch(initalSkip, q, clearData);
  },

  componentDidMount: function() {
    SearchStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SearchStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(newProps){
    const q = newProps.location.query.q;
    const clearData = true;
    this._fetch(initalSkip, q, clearData);
  },

  render :function() {
    const data = this.state.results;
    const length = Object.keys(data).length;

    const results = length>0?_.map(data, function(result, i) {
        return <ArticleItem key={i} article={result} />
    }):null;

    return <section className="container">
        <div className="page-header" style={searchHeader}>

        </div>
        <div className="content" >
        {results}

        <input onClick={this._onPost} value={this.state.url} />          
        </div>
    </section>;
  },

  _fetch: function(skip, q, clearData){
    SearchActions.getList(count, skip, q, clearData);
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

module.exports = About;