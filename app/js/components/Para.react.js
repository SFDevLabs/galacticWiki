
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Markdown = require('react-remarkable');

const Para = React.createClass({

  propTypes:{
    text: React.PropTypes.string.isRequired, 
    _key: React.PropTypes.number.isRequired, 
    onDown: React.PropTypes.func.isRequired,
    onUp: React.PropTypes.func.isRequired
  },
  
  render: function() {
    return <div onMouseDown={this._down} onMouseUp={this._up}>
      <Markdown  source={this.props.text} />
    </div>
  },
  _down: function(e){
    this.props.onDown(e, this.props._key)
  },
  _up: function(e){
    this.props.onUp(e, this.props._key)
  }

})

module.exports = Para;