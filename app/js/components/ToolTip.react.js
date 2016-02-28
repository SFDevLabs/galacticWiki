/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Markdown = require('react-remarkable');



const ToolTip = React.createClass({
  propTypes: {
    location: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func.isRequired
  },

  render: function() {
    // const toolTipEnable = this.state.toolTipEnable
    // var toolTipStyle;
    // var toolTipClass = ''
    // if (toolTipEnable){
    //   toolTipStyle = {
    //     display:"block",
    //     // top: this.toolTipPosition?this.toolTipPosition[1]-40:null,
    //     // left: this.toolTipPosition?this.toolTipPosition[0]-30:null,//'calc(50% - 150px)',
    //   }
    //   toolTipClass += 'in'
    // } else {
    //   toolTipStyle = {
    //     display:'block',
    //  //   top:'-100px'
    //   }
   // }

   
    const postionStyle = {
      display:'block',
      top:this.props.location[1],
      left:this.props.location[0] 
    };
    return <div style={postionStyle} className="popover top">
      <div className="arrow arrow-link"></div>
      <div className="btn-group">
        <button onClick={this.props.onClick} className="btn btn-primary">
          <span className="glyphicon glyphicon-link" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  }
})

module.exports = ToolTip;