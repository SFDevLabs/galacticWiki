/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Markdown = require('react-remarkable');



const ToolTip = React.createClass({
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
    return <div style={{display:'block'}} className="popover fade top in">
      <div className="arrow arrow-link"></div>
      <div className="btn-group">
        <button onClick={function(){alert()}} className="btn btn-primary">
          <span className="glyphicon glyphicon-link" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  }
})

module.exports = ToolTip;