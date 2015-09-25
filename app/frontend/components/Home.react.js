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

var colorsHex = require('../constants/colorsHex')

var Input = require('react-bootstrap').Input;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;

var mainLogoStyle = {
}

var mainInputFormStyle = {
	margin:'30px auto',
}
var mainInputStyle = {
	borderColor: colorsHex.deepSpacePurple
}
const innerButton = <Button style={mainInputStyle} ><Glyphicon glyph="search" /> | <Glyphicon glyph="link" /></Button>;


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
		});
		var inputAddonsInstance = (
		  <form id='mainInput' style={mainInputFormStyle}>
		    <Input
		    	style={mainInputStyle}
				autoFocus='true'
				type='text'
				value={this.state.value}
				onChange={this.keyDown}

			    buttonAfter={innerButton} />
		  </form>
		);
		var multilineJsx = (
			<div className="container">
				<div className="row text-center">
					<img className="text-center" src='img/logo.png'/>
				</div>
				<div className="row">
					<div className="col-md-2" />
					<div className="col-md-8">
						{inputAddonsInstance}
					</div>
					<div className="col-md-2" />
				</div>

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