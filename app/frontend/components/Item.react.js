/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');
var ReactPropTypes = React.PropTypes;

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
    	var item =  (
            <div>
        		<div>{this.props.title}</div>
                <hr />
                <div dangerouslySetInnerHTML={{__html: this.props.text}}></div>
            </div>
    		)
    	return item;
    }
});
module.exports = Item;
