var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;
var Glyphicon = require('react-bootstrap').Glyphicon;
var _ = require('lodash');

var popoverSection = {
    borderBottom: '1px solid #eee'
}

var divCircleStyle = {

    borderRadius: '50%',

    width: '29px',
    height: '29px',
    padding: '4px',
    marginRight:'3px',

    border: '2px solid',
    borderColor:'#666',
    color: '#666',
    textAlign: 'center',
    font: '14px Arial, sans-serif',
    textDecoration: 'none',

    position:'absolute',
    right:'0px'
};

var divCircleStyleNew = {

    borderRadius: '50%',
	top:'29px',
    width: '29px',
    height: '29px',
    padding: '4px',
    marginRight:'3px',

    color: '#777',
    textAlign: 'center',
    font: '14px Arial, sans-serif',
    textDecoration: 'none',

    position:'absolute',
    right:'0px'
};


var Overlay = React.createClass({
  displayName : 'Overlay',
  propTypes: {},
  mixins : [],
  getInitialState : function() {
  	return {};
  },
  componentWillMount : function() {},
  componentWillUnmount : function() {},
  render : function() {
    var overlayNew = (<Popover id={1}>
                <div className="text-center">
                    =Input
                </div>
        </Popover>)
     var overlay = (<Popover id={1}>
                <div style={popoverSection}>
                    <h4 style={{fontSize:"16px",color:'#666'}}>Business Schools Breed Unethical Businessmen</h4>
                    <p>Info</p>
                </div>
                <div style={popoverSection}>
                    <h4 style={{fontSize:"16px",color:'#666'}}>Business Schools Breed Unethical Businessmen</h4>
                    <p>Info</p>
                </div>
               </Popover>)

    return (<div>
	    		<OverlayTrigger trigger="click" placement="right" overlay={overlay}>
	                    <a href="javascript:void(null)" style={divCircleStyle}>1</a>
	            </OverlayTrigger>
	            <OverlayTrigger trigger="click" placement="right" overlay={overlayNew}>
	                    <a href="javascript:void(null)" style={divCircleStyleNew}>
							<Glyphicon onClick={this.newClick} glyph="plus" />
	                    </a>
	            </OverlayTrigger>
	        </div>)
	},
	newClick: function(){
		this.setState({newMode:true})
	}
});

module.exports = Overlay;

//var overlayMaker = (this.props.conceptCircle===false) ? function(){return null;}:OverlayMaker;
