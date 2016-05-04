
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const _ = require('lodash');
const Markdown = require('react-remarkable');
import { OverlayTrigger, Popover } from 'react-bootstrap'; 
import { Link } from 'react-router'; 

const Para = React.createClass({
  getInitialState: function() {
    return {
      text: this.props.text
    }
  },

  propTypes:{
    text: React.PropTypes.string.isRequired,
    sref: React.PropTypes.array.isRequired,
    tags: React.PropTypes.array.isRequired,
    onUp: React.PropTypes.func.isRequired,
    _key: React.PropTypes.number.isRequired,
    linkId: React.PropTypes.string,
    scrollID: React.PropTypes.bool
  },
  render: function() {
    const tags = this.props.tags.concat(this.props.sref);
    
    const text = this.buildParagraphs(tags, this.props.text);
    const scroll = this.props.scrollID?'scroll':null;
    return <p
      id={scroll}
      className="page-para" 
      onMouseDown={this._down} 
      onMouseLeave={this._leave} 
      onMouseUp={this._up} >
      {text}
    </p>
  },

  /**
   * Builds a Paragraphs text.
   */
  buildParagraphs: function(tags, text){
    const that = this;
    tags = _.sortBy(tags, function(tag){return tag.index[1]});
    
    var nodes=[];
    var beforeIndex = 0;
    //Iterate over the tags and add links to them.
    _.each(tags, function(tag, i){
      // Get the text and node surrounding the tags
      const beforeText = text.slice(beforeIndex, tag.index[0]);
      const nodeText = text.slice(tag.index[0], tag.index[1]);
      //const className = 

      
      const key = nodes.length-1;
      var linkClass = tag.sref?'link-sref':'link-href';
      if (tag._id === that.props.linkId)linkClass += ' highlight';

      const node = tag.sref?
      <Link to={'/'+tag.sref+'/link/'+tag._id} key={key} className={linkClass} >{nodeText}</Link>:
      <a target="_blank" href={tag.href} key={key} className={linkClass}> 
      {nodeText}
      <span className="glyphicon glyphicon-new-window" style={{fontSize: "1.3rem", marginLeft:'.4rem'}} />
      </a>

    // const popover = <Popover 
    //   id="popover-link">
    //     <strong>Holy guacamole!</strong> Check this info.
    // </Popover>
    //  const overLay = <OverlayTrigger
    //     key={key} 
    //     placement="top" overlay={popover}>
    //     {node}
    //   </OverlayTrigger>


      // Hold and index of the last node.
      beforeIndex = tag.index[1]
      // Push the nodes into the nodes array
      nodes.push(beforeText);
      nodes.push(node);
      nodes.push(afterText);
    });
    const lastIndex = tags.length>0?tags[tags.length-1].index[1]:0;
    const afterText = text.slice(lastIndex, text.length);// Get the trailing text for the paragraph.
    nodes.push(afterText);
    return nodes;
  },

  /**
   * Gets the page's selected text.
   */
  _down: function(e){
    this.down = true;
  },

  /**
   * Gets the page's selected text.
   */
  _up: function(e){
    const text = this._getSelectionText();
    const startIndex = this.props.text.indexOf(text)    
    const endIndex = startIndex + text.length;
    if ( this.down &&  startIndex!==-1 && text.length>0) {
      this.props.onUp(this.props._key, startIndex, endIndex);
    }
  },

  /**
   * Gets the page's selected text.
   */
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