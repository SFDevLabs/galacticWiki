/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('lodash');

var Item = React.createClass({
    displayName : 'Item',
    propTypes: {
        title: ReactPropTypes.string.isRequired,
        text: ReactPropTypes.string.isRequired
    },
    mixins : [],
    getInitialState : function() {
    	return {};
    },
    componentWillMount : function() {},
    componentWillUnmount : function() {},
    render : function() {

        var paragraphs = _.map(this.props.text, function(textItem){
            return (<p>{textItem}</p>)
        });
    	var item =  (
            <div>
        		<div>{this.props.title}</div>
                <hr />
                {paragraphs}
            </div>
    		)
    	return item;
    }
});
module.exports = Item;
