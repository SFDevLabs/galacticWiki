/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ArticleActions = require('../actions/ArticleActions');
var Link = require('react-router').Link;
var ImageLoader = require('react-imageloader');

var cx = require('react/lib/cx');

var ArticleItem = React.createClass({

  propTypes: {
   item: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },
  fallbackIco: "/img/fallback.ico",
  _imageLoadError : function(e){
    if (e.target.src.search(this.fallbackIco)===-1){
      e.target.src=this.fallbackIco
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var item = this.props.item;
    var siteToLink="/"+item.siteTo.id;
    var siteFromLink="/"+item.siteFrom.id;
    var Col = require('react-bootstrap').Col;
    var Row = require('react-bootstrap').Row;
    var user = item.edge.user;
    var userLink = "/user/"+user.username;
    return (
      <div className="recentConnectionsDiv">
        <Row className="siteRow">
          <div className="faviconBox"><Link to={siteToLink}><ImageLoader className="faviconImg" src={item.siteTo.favicon} onError={this._imageLoadError} /></Link></div>
          <div className="textHolder">
            <Link to={siteToLink}><div className="siteTitle">{item.siteTo.title}</div></Link>
            <Link to={siteToLink}><div className="siteURL">{item.siteTo.url}</div></Link>
            <div className="siteCount">{item.siteTo.connectionCount}</div>         
          </div>
        </Row>
        <Row className="separator">
          <div className="verticalBand">
          </div>
        </Row>
        <Row className="siteRow">
          <div className="faviconBox"><Link to={siteFromLink}><ImageLoader className="faviconImg" src={item.siteFrom.favicon} onError={this._imageLoadError} /></Link></div>
          <div className="textHolder">
           <Link to={siteFromLink}><div className="siteTitle">{item.siteFrom.title}</div></Link>
           <Link to={siteFromLink}><div className="siteURL">{item.siteFrom.url}</div></Link>
           <div className="siteCount">{item.siteFrom.connectionCount}</div>         

          </div>
        </Row>
        <Row className="edgeUsername">
          <Link to={userLink}>
            @{user.username}
          </Link> 
        </Row>
      </div>
    );
  },


  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _onSave: function(text) {
    ArticleActions.updateText(this.props.item.id, text);
    this.setState({isEditing: false});
  },

  _onDestroyClick: function() {
    ArticleActions.destroy(this.props.item.id);
  }

});

module.exports = ArticleItem;
