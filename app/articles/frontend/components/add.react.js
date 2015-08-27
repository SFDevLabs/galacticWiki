/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the ArticleStore and passes the new data to its children.
 */

var React = require('react');
var ArticleStore = require('../stores/ArticleStore');
var AddURLInput = require('./AddURLInput.react');
var ArticleActions = require('../actions/ArticleActions');
var ReactPropTypes = React.PropTypes;
var utils = require('../../../main/frontend/utils');
var Immutable = require('immutable');
var _inputs = Immutable.OrderedMap();
var cx = require('classnames');

var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Button = require('react-bootstrap').Button;

var Navigation = require('react-router').Navigation;

function setInput(data, inputNumber){
	_inputs = _inputs.set(inputNumber, new InputRecord(data) );
}

function clearInput(){
	_inputs = _inputs.set(0, new InputRecord({}) );
	_inputs = _inputs.set(1, new InputRecord({}) );
}

function destroy(id) {
  _inputs = _inputs.delete(id);
}

var InputRecord = Immutable.Record({
  id : null,
  url : null,
  title: null
});

function getInputState(){
	return _inputs.toJSON();
}

var Add = React.createClass({
	mixins: [Navigation],
	// propTypes: {
	// 	value: ReactPropTypes.string
	// },

	getInitialState: function() {
		if (!utils.isLoggedIn()){utils.loginRedirect('/login')};
		return getInputState();
	},

	componentDidMount: function() {
	 	ArticleStore.addSaveListener(this._saveComplete);
	},

	componentWillUnmount: function() {
		clearInput();
	    ArticleStore.removeSaveListener(this._saveComplete);
	},

	render: function() {
	//move this logix to the back end
	//var same = (<h4>URLS can not be the same!</h4>)
	//var  equals = valueOne.length>0 && valueOne===valueTwo?same:null;

	var inputs = this.state;
	var selectItemIdOne = !inputs[0]?null:inputs[0].id;
	var selectItemIdTwo = !inputs[1]?null:inputs[1].id;
	return (
    <Grid className="mainBody connectionBox">
      <Row className="">
			<AddURLInput onSelect={this._onSelect} selectItemID={selectItemIdOne} excludeItemID={selectItemIdTwo} inputNumber={0} autoFocus={true} />
       </Row>
       <Row>
        <img className="connectMetaphor" className="connectMetaphor" src="img/connect_metaphor.png" />
       </Row>
       <Row>
	    	<AddURLInput onSelect={this._onSelect} selectItemID={selectItemIdTwo} excludeItemID={selectItemIdOne} inputNumber={1} />
		</Row>
		<Row>
		 	<Button onClick={this._onClick} className={cx({enabled:this._canCreateEdge(),connect:true})}>Connect URLs</Button>
		</Row>
    </Grid>
	  )
	},

	/**
	* Invokes save to the server
	*/
	_onSave: function(inputs) {
      	ArticleActions.create(inputs);
	},

	/**
	* Invokes save to the server
	*/
	// _clearInputs: function() {
 //      	clearInput();
 //      	this.setState(getInputState());
	// },

	/**
	* Invokes the callback passed in as onSave, allowing this component to be
	* used in different ways.
	*/
	_onClick: function(valueOne, valueTwo) {
		if (this._canCreateEdge()){
			var inputs = getInputState();
			this._onSave(inputs)
		}
	},
	/**
	* Invokes the callback passed in as onSave, allowing this component to be
	* used in different ways.
	*/
	_canCreateEdge: function() {

		return this.state[0]!==undefined && this.state[1]!==undefined && this.state[0].url!==null && this.state[1].url!==null
	},

	/**
	* Event handler for 'change' events coming from the ArticleStore
	*/
	_saveComplete: function() {
		//var id = getInputState()[0].id
		this.transitionTo('articles',{},{});
	},

	/**
	* @param {object} event
	*/
	_onSelect: function(data, inputNumber) {

		setInput(data, inputNumber);
		this.setState(getInputState());
	}

});

module.exports = Add;
