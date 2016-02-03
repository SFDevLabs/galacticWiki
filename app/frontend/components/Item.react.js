/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');
var Overlay = require('./Overlay.react');

var marginRightStyle =  {
    marginRight:'33px'
}
var paddingRight =  {
    paddingRight:'33px'
}


var parent = {
    position:'relative'
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


var Item = React.createClass({
    displayName : 'Item',
    propTypes: {
        title: ReactPropTypes.string.isRequired,
        description: ReactPropTypes.string.isRequired,
        text: ReactPropTypes.array.isRequired,
        newClick: ReactPropTypes.func.isRequired,
        conceptCircle: ReactPropTypes.bool
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
                                <Overlay />
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
                    <Overlay />
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
