
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Loader = require('react-loader');
const Actions = require('../actions/ArticleActions');
const parse = require('url-parse');

const PageConnect = React.createClass({

  propTypes:{
    page: React.PropTypes.object.isRequired
  },

  render :function() {
    const page = this.props.page;
    const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} style={{width:'16px', height:"16px", marginBottom: '2px'}} />:null;


    return <div className="row">
      <div className="link-main">
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
        <div className="link-text">
          <p style={{borderBottom: '1px solid #eee'}}>
            <span>Within the next few weeks, President Obama will call up one of the nation’s top legal minds and initiate one of the trickier conversations of his presidency.</span>
            <a href="javascript:void(0);" >He will offer him or her the honor of a lifetime—an appointment to the Supreme Court</a>
            <span>—and then he’ll share a caveat they already know: It’s a nomination that’s probably doomed from the start.</span>
          </p>
        </div>
      </div>
    </div>
  }
})

module.exports = PageConnect;