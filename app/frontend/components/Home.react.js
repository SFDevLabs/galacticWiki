/**
 * @jsx Home.react
 */
'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;
var Store = require('../stores/Store');
var actions = require('../actions/Actions');
var Utils = require('../utils');
var _ = require('lodash');
var searchDelay = 1000;

var Home = React.createClass({
	displayName : 'Home',
	propTypes: {},
	mixins : [],
	getInitialState : function() {
		return {};
	},
	componentWillMount : function() {
	    this.delayedCallback = _.debounce(this.delayedKeyDown, searchDelay);
    },
	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function () {
		var multilineJsx = (
			<div className="container">
				<Input
					autoFocus='true'
					type='text'
					value={this.state.value}
					onChange={this.keyDown} />
			</div>
		);
		return multilineJsx;
	},
	/**
	 * @name   On Change Callback
	 * @desc   Calls a debounced function
	 * Refrence -> http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
	 */
	keyDown: function (event) {
	    event.persist();
	    this.delayedCallback(event);
	},
	/**
	 * @name   onChangeSetState
	 * @desc   Sets the state from the debounce created in componentWillMount
	 * @param  {obj}      event
	 */
	delayedKeyDown: function (event) {
		actions
	},

	_onChange:function(){
		this.setState({response: Store.getPageData(event.target.value)});
	}

});
module.exports = Home;