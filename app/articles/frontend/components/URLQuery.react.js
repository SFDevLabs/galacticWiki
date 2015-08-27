/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the QueryStore and passes the new data to its children.
 */

var React = require('react');
var URLQueryResult = require('./URLQueryResult.react');

var Loader = require('react-loader');
var $ = require('jquery');
var urlBase = '/apigraph/query/'
var errorObj = require('../../../main/frontend/errorHandle');
var utils = require('../../../main/frontend/utils');
var csrfToken = utils.getCsrfToken()
/**
 * Make a stateless ajax call to the search api.
 */
function queryHandler(url, cb) {
  $.ajax({
    method: "GET",
    url: urlBase,
    data: {_csrf:csrfToken, url:url},
  })
  .done(function( results ) {
    cb(null, results.data);
  }).error(errorObj.errHandle);
}


/**
 * Retrieve the current TODO data from the QueryStore
 */
function getQueryState(data, loader) {
  return {
    search: data,
    loader: loader? loader:false
  };
}

var Query = React.createClass({
  
  getInitialState: function() {
    return getQueryState(null, true);
  },

  componentDidMount: function() {
    this.setState(getQueryState(null, true));
    this._query(this.props.query); 
  },

  // componentWillUnmount: function() {
  //   QueryStore.removeChangeListener(this._onChange);
  // },

  componentWillReceiveProps: function(newProps) {
    this.setState(getQueryState(null, true));
    this._query(newProps.query); 
  },

  /**
   * @return {object}
   */

  render: function() {
    var search = this.state.search;
    var loader = this.state.loader;
    var result;
    

    // var result;
    if (loader===true) {  //Empty resonse wait for ajax response
      result = (<Loader/>)
    }else if ($.isEmptyObject(search)){ //No response from search api.
      result = (<div>No Result</div>)
    }else{
      var result=[];
      for (var key in search) {
        result.unshift(<URLQueryResult key={key} post={search[key]} />);
      }
    }//end of results

    return (
      <div className="row searchResults">
        {result}
      </div>)
    
  },

  /**
   * Event handler for 'change' events coming from the QueryStore
   */
  _onChange: function() {
    this.setState(getQueryState(this.props.query));
  },
  /**
   * Event handler called within query.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _query: function(q){
    var that= this;
    queryHandler(q, function(err, data){
      that.setState(getQueryState(data));
    });
  },

});

module.exports = Query;
