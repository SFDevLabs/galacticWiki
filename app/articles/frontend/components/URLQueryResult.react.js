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


var QueryResult = React.createClass({
  propTypes: {
   post: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */


  render: function() {
    var post = this.props.post;
    var siteLink="/"+post.id;
      return (
          <div>
            THIS WHOLE PAGE NEEDS REDOING
            <div className="columns sixteen resultsFor"></div>
            <Link to={siteLink} >
              <div className="searchResultBox">
                <ul className="row marginZero">
                  <li className="columns four marginZero"><img src="img/blank.png" /></li>
                  <li className="columns eight searchResult">
                    <div className="columns sixteen">
                      <ul className="row sixteen marginZero">
                        <li className="columns three"><img className="searchResultImg" src={post.favicon} />
                        </li>
                        <li className="columns eleven searchResultText">
                          <div className="searchResultTitle">{post.title}</div>
                          <div className="searchResultURL">{post.url}</div>
                        </li>
                        <li className="columns two userSubmission"><img className="userSubmissionImg" src="/img/eoin_profile.jpg"/>{post.username}</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </Link>
          </div>
          )
  }

});

module.exports = QueryResult;
