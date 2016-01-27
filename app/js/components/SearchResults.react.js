
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/SearchActions');
const SearchStore = require('../stores/SearchStore');
const _ = require('lodash');
const skip = 0;
const count = 5;

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
    results: SearchStore.getAll()
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
    Actions.getList(count, skip, q, clearData);
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
    Actions.getList(count, skip, q, clearData);
  },

  render :function() {
    return <section className="container">
        <div className="page-header" style={searchHeader}>

        </div>
        <div className="content" >
          {JSON.stringify(this.state.results)}
        </div>
    </section>;
  },

  /**
   * Event handler for 'change' events coming from the SearchStore
   */
  _onChange: function() {
    this.setState(getState())
  }

})

module.exports = About;