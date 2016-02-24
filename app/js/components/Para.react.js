
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const _ = require('lodash');
const Markdown = require('react-remarkable');

function createMarkup(text) { return {__html: text}; };

const Para = React.createClass({
  getInitialState: function() {
    return {
      text: this.props.text
    }
  },

  propTypes:{
    text: React.PropTypes.string.isRequired,
    style: React.PropTypes.array.isRequired,
    _key: React.PropTypes.number.isRequired
  },

  render: function() {

    const a = this.props.text.slice(0,3);
    const b = this.props.text.slice(3);

    return <div
      className="page-para" 
      onMouseDown={this._down} 
      onMouseLeave={this._leave} 
      onMouseUp={this._up}>
      <p>{[<i key={0} >{a}</i>,<a key={1}>{b}</a>]}</p>
    </div>
  },
  _down: function(e){
    this.down = true;
  },
  _up: function(e){    
    if (this.down){

    }
  },
  _leave: function(e){
    this.down = false;
  },
  /**
   * Gets the page's selected text.
   */
  _getSelectionText: function() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
  }

})

module.exports = Para;