
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const SearchInput = require('./SearchInput.react');
const PageSearchResults = require('./PageSearchResults.react');

const PageSelection = React.createClass({

  propTypes:{
    page: React.PropTypes.object.isRequired,
    paragraph: React.PropTypes.number.isRequired,
    index: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {}; 
  },

  render :function() {
    const page = this.props.page;
    const paragraph = page.text[this.props.paragraph];

    const index = this.props.index;

    const beforeText = paragraph.slice(0, index[0]);
    const afterText = paragraph.slice(index[1]);
    const selectedText = paragraph.slice(index[0], index[1]);
    
    const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} style={{width:'16px', height:"16px", marginBottom: '2px'}} />:null;

    return <div className="row">
      <div className="connect-main">
        <div className="header">
          <h2>
            {favicon}
            &nbsp;
            {page.title} 
            &nbsp;
            <a href={page.canonicalLink} target="_blank">
              <span style={{fontSize:'1.2rem'}} className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
            </a> 
          </h2>
        </div>
        <div>
          <p className="connect-surrounding-text">
            {beforeText}
            <a className="link-text" href="javascript:void(0);" > {selectedText} </a>
            {afterText}
          </p>
        </div>
      </div>
    </div>
  }

})

module.exports = PageSelection;