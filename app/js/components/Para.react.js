
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const _ = require('lodash');
const Markdown = require('react-remarkable');
const ToolTip = require('./ToolTip.react');

function createMarkup(text) { return {__html: text}; };

const Para = React.createClass({
  getInitialState: function() {
    return {
      text: this.props.text
    }
  },

  propTypes:{
    text: React.PropTypes.string.isRequired,
    tags: React.PropTypes.array.isRequired,
    onUp: React.PropTypes.func.isRequired,
    _key: React.PropTypes.number.isRequired
  },

  render: function() {
    const text = this.buildParagraphs(this.props.tags, this.props.text);
    return <p
      className="page-para" 
      onMouseDown={this._down} 
      onMouseLeave={this._leave} 
      onMouseUp={this._up} >
      {text}
    </p>
  },
  buildParagraphs: function(tags, text){

    var nodes=[];
    var beforeIndex = 0;
    _.each(tags, function(tag, i){

      const beforeText = text.slice(beforeIndex, tag.index[0]);

      const nodeText = text.slice(tag.index[0], tag.index[1]);

      const node = React.createElement(tag.name, {key: nodes.length-1, href: tag.href, target: '_blank'}, nodeText);

      beforeIndex = tag.index[1]

      nodes.push(beforeText);
      nodes.push(node);
      nodes.push(afterText);

    });
    const lastIndex = tags.length>0?tags[tags.length-1].index[1]:0;
    const afterText = text.slice(lastIndex, text.length-1);
    nodes.push(afterText);
    return nodes;
  },

  _down: function(e){
    this.down = true;
  },
  _up: function(e){    
    if (this.down){

      this.props.onUp()
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