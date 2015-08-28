/**
 * @jsx Home.react
 */
"use strict";

var React = require('react');
var Input = require('react-bootstrap').Input;

var Home = React.createClass({
	displayName : '',
	propTypes: {},
	mixins : [],
	getInitialState : function() {
		return {};
	},
	componentWillMount : function() {},
	componentWillUnmount : function() {},
	render: function () {
		var multilineJsx = (
			<div>
				<Input
			        type='text'
			        value={this.state.value}
			        onChange={this.handleChange} />

			</div>
		);
		return multilineJsx;
	},
	handleChange: function(event){
		this.setState({value: event.target.value});
	}
});
module.exports = Home;