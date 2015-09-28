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
    width: '10px',
    height: '10px',
    background: '#4700B2',
    MozBorderRadius: '50px / 50px',
    WebkitBordeRadius: '50px / 50px',
    borderRadius: '50px / 50px',
    position:'absolute',
    right:'-30px'
};
var descriptionStyle = {
    color:'#ddd'
}
var parent = {
    position:'relative'
}

var Item = React.createClass({
    displayName : 'Item',
    propTypes: {
        title: ReactPropTypes.string.isRequired,
        description: ReactPropTypes.string.isRequired,
        text: ReactPropTypes.array.isRequired
    },
    mixins : [],
    getInitialState : function() {
    	return {};
    },
    componentWillMount : function() {},
    componentWillUnmount : function() {},
    render : function() {

        var paragraphs = _.map(this.props.text, function(textItem, i){
            return (<div key={i} style={parent}>
                        <div style={divCircleStyle}></div>
                        <p>{textItem}</p>
                    </div>)
        });
    	var item =  (
            <div>
        		<h1>{this.props.title}</h1>
                <br />
                <h2 style={descriptionStyle} >{this.props.description}</h2>
                <hr />
                {paragraphs}
            </div>
    		)
    	return item;
    }
});
module.exports = Item;
