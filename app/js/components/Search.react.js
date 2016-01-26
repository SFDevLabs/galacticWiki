
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Link } from 'react-router';
const Actions = require('../actions/SearchActions');
const _ = require('lodash');
const SEARCH_DELAY = 1000;


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
const About = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  componentWillMount : function() {
    this._delayedCallback = _.debounce(this._delayedKeyDown, SEARCH_DELAY);
  },
  
  render :function() {
    return <section className="container">
        <div className="page-header" style={searchHeader}>
            <div className="col-md-2">
            </div>
            <div className="col-md-8">
              <div className="row">
                <input 
                  type="text" 
                  className="form-control"
                  onChange={this._keyDown}
                />
              </div>
              <div className="row text-center" style={searchRow}>
                <button style={searchButton} type="button" className="btn btn-default">
                  Search Galactic
                </button>
                <button style={searchButton} type="button" className="btn btn-default">
                  Make A Connection
                </button>
              </div>
            </div>
        </div>
        <div className="content" >

        </div>
    </section>;
  },
  /**
   * @name   On Change Callback
   * @desc   Calls a debounced function
   * Refrence -> http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
   */
  _keyDown: function (event) {
      event.persist();
      this._delayedCallback(event);
  },
  /**
   * @name   onChangeSetState
   * @desc   Sets the state from the debounce created in componentWillMount
   * @param  {obj}      event
   */
  _delayedKeyDown: function (event) {
    
    Actions.getList(5, 0, event.target.value)
    //this.context.router.push('/?q=');
  
  }

})

module.exports = About;