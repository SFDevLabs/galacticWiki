/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Alert } from 'react-bootstrap'; 
const _ = require('lodash');

const Messages = React.createClass({
  
  props:{
  	messages: React.PropTypes.func.isRequired,
  	type: React.PropTypes.string.isRequired//Possible values: warning, danger, info, success
  },

  getInitialState:function(){
    return {
      removed: false,
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    const type = this.props.type;

    const messages = _.map(this.props.messages, function(message, i){
      return <ul key={i}>
        <li>{message}</li>
      </ul>
    });
    const removed = this.state.removed

    const JSX = !removed ?
      <Alert  bsStyle={type} onDismiss={this._notVisible}>
        {messages}
      </Alert>:
    null;
    return JSX
  },
  /**
    * _notVisible
   */
  _notVisible:function(){
    this.setState({
      removed: true
    });
  }

});

module.exports = Messages;
