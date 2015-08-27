/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ENTER_KEY_CODE = 13;
var Navigation = require('react-router').Navigation;
var AutoCompleteItem = require('./AutoCompleteItem.react');
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
    cb(null, results);
  }).error(errorObj.errHandle);
}

/**
 * Retrieve the current TODO data from the QueryStore
 */
function getQueryState(data, loader, newItem) {
  return {
    search: data,
    loader: loader? loader:false,
    newItem: newItem? newItem:false
  };
};

var AutoComplete = React.createClass({

  // mixins: [Navigation],
  propTypes: {
    query: ReactPropTypes.string.isRequired,
    onSelect: ReactPropTypes.func.isRequired,
    inputNumber: ReactPropTypes.number.isRequired,
    selectItemID: ReactPropTypes.number,
    excludeItemID: ReactPropTypes.number
  },

  getInitialState: function() {
    return getQueryState(null , true);
  },

  _quearyEfficientFn: utils.debounce(function(q) {
    this._query(q) 
  }, 750),

  componentWillReceiveProps: function(newProps) {
    if (newProps.query.length>0 && newProps.query!==this.props.query){
      this.setState(getQueryState(null, true))
      this._quearyEfficientFn(newProps.query);
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    //var items = [(<AutoCompleteItem/>), (<AutoCompleteItem/>)];
    var loader = this.state.loader;
    var search = this.state.search;
    var newItem = this.state.newItem;
    var query = this.props.query;
    var result;
    
    if (query.length===0){
      result= null;
    } else if (loader===true) {  //Wait for ajax response
      result = this._loader;
    } else if (newItem){
      result=(
        <div>
          <h5>This is a New Site!</h5>
          <AutoCompleteItem selected={true} post={newItem} onSelect={this.props.onSelect} inputNumber={this.props.inputNumber}/>
        </div>
        );
    } else if ( $.isEmptyObject(search) ){ //No response from search api.
      
      result = (<div>
        <i>Not a valid site!</i>
        </div>)
      
    } else {
      var result=[];
      for (var key in search) {
        var item = search[key]
        var selected = true//item.id===this.props.selectItemID?true:false;
        if (item.id!==this.props.excludeItemID ){
          result.unshift(<AutoCompleteItem selected={selected} key={key} post={item} onSelect={this.props.onSelect} inputNumber={this.props.inputNumber}/>);
        }
      }
    }//end of results

    return (
      <ul className="autoCompleteResults">
        {result}
      </ul>
    );
  },

  /**
   * Event handler for 'change' events coming from the QueryStore
   */
  _query: function(q){
    var that= this;
    queryHandler(q, function(err, result){
      that.setState(getQueryState(result.data, false, result.newItem));
      
      var inputItem;
      if (result.newItem){
        inputItem=result.newItem
      }else if(result.data.length>0){
        inputItem=result.data[0]
      }
      that.props.onSelect(inputItem, that.props.inputNumber);
    });
  },


  _loader: (<Loader className="loader"/>)

});


module.exports = AutoComplete;