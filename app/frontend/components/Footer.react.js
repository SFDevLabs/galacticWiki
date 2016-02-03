/**
 * @jsx Header.react
 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;
var utils = require('../utils');
var colorsHex = require('../constants/colorsHex')
var Store = require('../stores/Store');

var footStyle = {
    backgroundColor: colorsHex.backgroundColorBase,
    borderTopColor: colorsHex.deepSpacePurple,
    bottom: 0,
    width: '100%',
    marginTop:'20px'
  }

const linkColor={
  color:colorsHex.neutralText
}

var G_Footer = React.createClass({
  getInitialState : function() {
    return {};
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },
  render: function () {

    footStyle.position = this.state.isInSearchResultMode?'initial':'absolute';

    var jsx = (
      <footer style={footStyle} className="footer">
        <div className='container'>
          <div className="row">
            <ul style={{paddingTop:'5px'}} className="list-inline">
              <li><a style={linkColor} href='/about'>About</a></li>
              <li><a style={linkColor} href='/contact'>Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
    return jsx;
  },

  _onChange:function(){
    this.setState({isInSearchResultMode:Store.getPageData().length>=1});
  }
});
module.exports = G_Footer;
