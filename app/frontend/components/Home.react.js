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
	margin:'30px auto'
}
var sectionIndentStyle = {
	paddingRight:'30px'
}

var mainInputStyle = {
	borderColor: colorsHex.deepSpacePurple
}

var mainResultStyle = {
	borderColor: colorsHex.deepSpacePurple
}
const innerButton = <Button style={mainInputStyle} ><Glyphicon glyph="search" /></Button>;


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
		var that  = this;
		var results = _.map(this.state.pages, function(page){
			return <Item
				key={page._id}
				title={page.title}
				text={page.text}
				description={page.description}
				newClick={that.newClick}
				conceptCircle={true}
			/>
		});
		var inputAddonsInstance = (
		  <form id='mainInput' style={mainInputFormStyle}>
		    <Input
		    	style={mainInputStyle}
				autoFocus='true'
				type='text'
				value={this.state.value}
				onChange={this.keyDown}
			    buttonAfter={innerButton}
			/>
		  </form>
		);

		var spacingSection = this.state.itemSelected?null:(<section className="col-md-3"/>);
		var image = this.state.pages?"": <div className="row text-center"><img className="text-center" src='img/logo.png'/></div>;
		var multilineJsx = (
			<div>
				<div className="container">
					{image}
					<div className="col-md-3"/>
					<div className="row col-md-6">
						{inputAddonsInstance}
					</div>
				</div>
				<div className="container">
					{spacingSection}
					<section style={sectionIndentStyle} className="col-md-6">
						<div className="row">
							{results[0]}
						</div>
					</section>
					<section style={sectionIndentStyle} className="col-md-6">
						<div className="row">
							{results[0]}
						</div>
					</section>
				</div>
			</div>
		);
		return multilineJsx;
	},
	/**
	 * @name   On Change Callback
	 * @desc   Calls a debounced function
	 * Refrence -> http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
	 */
	newClick: function (event) {
	    this.setState({itemSelected:true, pages: Store.getPageData(), pending:Store.getSearchPendingStatus()});
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