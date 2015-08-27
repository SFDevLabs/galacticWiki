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
 * the ArticleStore and passes the new data to its children.
 */

var React = require('react');
var Home = require('./Home.react');
var URLQuery = require('./URLQuery.react');


// /**
//  * Retrieve the current TODO data from the ArticleStore
//  */
// function getArticleState() {
//   return {
//     allPosts: ArticleStore.getAll(),
//   };
// }


var Main = React.createClass({
  render: function() {
  	var q = this.props.query.q;
    var result = q ? (<URLQuery query={q} />): (<Home/>);
    return (<div>
    		{result}
    		</div>)
    }
});

module.exports = Main;
