
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ENTER_KEY_CODE = 13;

function getState(props){
  return {
      value: props.value || ''
    }
}

const SearchInput = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    width: React.PropTypes.string
  },
  

  getInitialState: function() {
    return getState(this.props)
  },

  componentWillReceiveProps: function(newProps) {
    this.setState(getState(newProps))
  },

  render :function() {
    const inputWidth = this.props.width? {width:this.props.width}:null;
    return <span className="input-group">
      <input 
        style={inputWidth}
        type="search" 
        className="form-control"
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value} />
      <span className="input-group-btn">
        <button onClick={this._save} className="btn btn-default">
          <span className="glyphicon glyphicon-search"></span>
        </button>
      </span>
    </span>


  },
  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
  _save: function() {
    this.props.onSave(this.state.value);
  },

  /**
   * @param {object} event
   */
  _onChange: function(/*object*/ event) {
    this.setState({
      value: event.target.value
    });
  },

  /**
   * @param  {object} event
   */
  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }
})

module.exports = SearchInput;