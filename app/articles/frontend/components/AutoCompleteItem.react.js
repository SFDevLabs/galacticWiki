/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var cx = require('classnames');

var ReactPropTypes = React.PropTypes;



var AutoCompleteItem = React.createClass({
  propTypes: {
    post: ReactPropTypes.object.isRequired,
    onSelect: ReactPropTypes.func.isRequired,
    inputNumber: ReactPropTypes.number,
  },

  componentDidMount: function() {
    if (this.props.selected){
      this.props.onSelect(this.props.post, this.props.inputNumber);
    }
  },

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post
    return (
      <li className={cx({
          selected:this.props.selected,
          media: true
        })}>
        <div className="media-left media-middle addIconBox">
          <a href="#">
            <img className="media-object addIcon" src="img/logo_clustr_icon.png" alt="..."></img>
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{post.title}</h4>
          {post.url}
        </div>
      </li>

      );


  },
  _onClick:function(event){
    var inputNumber = this.props.inputNumber;
    var url = this.props.post.url;

    if (this.props.post.id){
      this.props.onSelect(this.props.post, this.props.inputNumber);
    }
    // this.props.setSelected(this.props.post.id)
  }

});

module.exports = AutoCompleteItem;