/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Markdown = require('react-remarkable');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const ToolTip = React.createClass({
  propTypes: {
    location: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func.isRequired
  },

  render: function() {
   
    const postionStyle = {
      display:'block',
      top:this.props.location[1],
      left:this.props.location[0] 
    };

    return <ReactCSSTransitionGroup transitionAppear={true} transitionName="fall" transitionAppearTimeout={200} transitionEnterTimeout={200} transitionLeaveTimeout={200}  >
      <div style={postionStyle} className="popover top main-popover">
        <div className="arrow arrow-link"></div>
        <div className="btn-group">
          <button onClick={this.props.onClick} className="btn btn-primary">
            <span className="glyphicon glyphicon-link" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </ReactCSSTransitionGroup>

  }
})

module.exports = ToolTip;