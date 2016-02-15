
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Markdown = require('react-remarkable');

const Para = React.createClass({
  propTypes:{
    text: React.PropTypes.string.isRequired
  },
  
  render :function() {
    return <div onMouseDown={this._on} onMouseUp={this._onUp}>
      <Markdown  source={this.props.text} />
    </div>
  },
  /**
   * Event handler for 'click' events coming from the Page DOM
   */
  _on:function(e){
    console.log(e, 'down')
    e.pageX
    e.pageY


    // this.setState({
    //   linkLocation:e.target.offsetTop
    // });
  },
  /**
   * Event handler for 'click' events coming from the Page DOM
   */
  _onUp:function(e){
    console.log(e, 'up')


    // this.setState({
    //   linkLocation:e.target.offsetTop
    // });
  }
})

module.exports = Para;