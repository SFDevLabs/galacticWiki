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
var Item = require('./Item.react');

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
		var results = _.map(this.state.pages, function(page){
			return <Item title={page.title} text={page.text} description={page.description} />
		})
		var multilineJsx = (
			<div className="container">
				<Input
					autoFocus='true'
					type='text'
					value={this.state.value}
					onChange={this.keyDown} />
				{results}
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
		actions.search(event.target.value);
	},

	_onChange:function(){
		this.setState({pages: Store.getPageData(), pending:Store.getSearchPendingStatus()});
	}

});
module.exports = Home;