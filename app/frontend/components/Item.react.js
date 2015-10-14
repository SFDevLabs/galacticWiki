/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;


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

var marginRightStyle =  {
    marginRight:'33px'
}
var paddingRight =  {
    paddingRight:'33px'
}


var parent = {
    position:'relative'
}

var popoverSection = {
    borderBottom: '1px solid #eee'
}

var descriptionStyle = {
    color:'#ddd',
    fontSize: '24px'
}
_.assign(descriptionStyle, paddingRight)
var titleStyle = {
}
_.assign(titleStyle, paddingRight)

var paragraphStyle = {
    fontFamily: 'Georgia, Times, \'Times New Roman\', serif',
    fontSize: '17px',
}
_.assign(paragraphStyle, paddingRight)



var overlayMaker = function(i){

    var overlay =(
        <Popover id={i?i:""}>
                <div style={popoverSection}>
                    <h4 style={{fontSize:"16px",color:'#666'}}>Business Schools Breed Unethical Businessmen</h4>
                    <p>Info</p>
                </div>
                <div>
                    <h4 style={{fontSize:"16px",color:'#666'}}>Business Schools Breed Unethical Businessmen</h4>
                    <p>Info</p>
                </div>
               </Popover>
               )
    return (<OverlayTrigger  trigger="click" rootClose placement="right" overlay={overlay}>
                    <a href="javascript:void(null)" style={divCircleStyle}>1</a>
            </OverlayTrigger>)
}


var Item = React.createClass({
    displayName : 'Item',
    propTypes: {
        title: ReactPropTypes.string.isRequired,
        description: ReactPropTypes.string.isRequired,
        text: ReactPropTypes.array.isRequired,
        newClick: ReactPropTypes.func.isRequired
    },
    mixins : [],
    getInitialState : function() {
    	return {};
    },
    componentWillMount : function() {},
    componentWillUnmount : function() {},
    render : function() {
        var that = this;
        var paragraphs = _.map(this.props.text, function(textItem, i){
            var paragraph = (<div  key={i} style={parent} >
                                {overlayMaker()}
                                <p onClick={that.props.newClick} style={paragraphStyle}>{textItem}</p>
                             </div>)
            return paragraph;
        });
    	var item =  (
            <div>
                <div style={parent}>
            		<h1>{this.props.title}</h1>
                </div>
                <br />
                <div style={parent}>
                    {overlayMaker()}
                    <h2 style={descriptionStyle} >{this.props.description}</h2>
                    <hr style={marginRightStyle} />
                    {paragraphs}
                </div>
            </div>
    		)
    	return item;
    }
});
module.exports = Item;
