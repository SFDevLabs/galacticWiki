/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the QueryStore and passes the new data to its children.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;
var QueryActions = require('../actions/QueryActions');
var Loader = require('react-loader');
var Link = require('react-router').Link;
var ImageLoader = require('react-imageloader');

var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;

var QueryResult = React.createClass({
  propTypes: {
   post: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  _imageLoadError : function(e){
    e.target.src="img/fallback.ico"
  },

  render: function() {
    var post = this.props.post.site;
    var user = this.props.post.user;
    var siteLink="/"+post.id;
    var userLink = "/user/"+user.username;
    var posthref="//"+post.url
    return (
            <Row className="siteConnection">
              <Col md={3}></Col>
              <Col md={7} className="midCol">
                <Row className="resultRow">
                  <div className="searchResultImgBox"><Link to={siteLink}><ImageLoader className="searchResultImg" src={post.favicon} onError={this._imageLoadError} /></Link>
                  </div>
                  <div className="searchResultText">
                    <Link to={siteLink}><div className="searchResultTitle">{post.title}</div></Link>
                    <a target="_blank" href={posthref}><div className="searchResultURL">{post.url}</div></a>
                  </div>
                </Row>
                <Row className="userNameBox">                    
                <Link to={userLink}>
                 <div className="userName">@{user.username}
                  </div>
                </Link> 
                </Row>
              </Col>
              <Col md={2}></Col>
            </Row>
        )
  }

});

module.exports = QueryResult;
