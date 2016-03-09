
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('lodash');
const Markdown = require('react-remarkable');
import { OverlayTrigger, Popover } from 'react-bootstrap'; 
import { Link } from 'react-router';

function createMarkup(text) { return {__html: text}; };

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
    linkId: React.PropTypes.string.isRequired
  },
  componentDidMount() {
    const that = this;
    if (this.state.srefObject){
      setTimeout(function(){
        const node = ReactDOM.findDOMNode(that);
        window.scroll(0, node.offsetTop-150);
      },100)
    }
  },
  render: function() {
    const tags = this.props.tags.concat(this.props.sref);


    console.log(tags, this.props.linkId, _.find(this.props.sref, {_id:linkId}))
    const linkId = this.props.linkId;
    
    let style = this.state.srefObject?null: {color:'#999'};
    // if (linkId){
    //   //const linkIdData = _.find(tags, {_id:linkId})
    //   style = this.state.srefObject?{color:'#999'}:{color:'#eee'};
    // } else{
    //   style = null;
    // }
    
    const text = this.buildParagraphs(tags, this.props.text);
    return <p
      style={style}
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

      const node = tag.sref?
        <Link to={'/'+tag.sref+'/link/'+tag._id} key={nodes.length-1} className='href-link'>{nodeText}</Link>:
        <a key={nodes.length-1}>{nodeText}</a>

      // React.createElement(
      //   tag.name, 
      //   {
      //     key: nodes.length-1,
      //     href: 'javascript:void(0);',
      //     target: '_blank', 
      //     className: 'href-link',
      //     onClick: that._onClick
      //   },
      //   nodeText
      // );
    // const popover = <Popover 
    //   id="popover-link">
    //     <strong>Holy guacamole!</strong> Check this info.
    // </Popover>
    //  const overLay =  <OverlayTrigger
    //     key={nodes.length-1} 
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
  },
  /**
   * Enter
   */
  _onClick: function(e){
    // this.refs.popover.show();
    //console.log(e, 'l')
  }

})

module.exports = Para;