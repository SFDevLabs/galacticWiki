/**
 * @jsx Home.react
 */
'use strict';
var React = require('react');

var Item = React.createClass({
    displayName : 'Item',
    propTypes: {},
    mixins : [],
    getInitialState : function() {
    	return {};
    },
    componentWillMount : function() {},
    componentWillUnmount : function() {},
    render : function() {
    	var item =  (
    		<div>Love</div>
    		)
    	return item;
    }
});
module.exports = Item;
