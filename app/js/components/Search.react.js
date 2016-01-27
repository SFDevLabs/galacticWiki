
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ENTER_KEY_CODE = 13;

const searchHeader = {
  borderBottom:'none'
}

const searchRow = {
  paddingTop:'25px'
}

const searchButton = {
  marginRight:'30px',
  padding: '8px 20px',
  fontSize: '1.1em'
}

const About = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {};
  },
  
  render :function() {
    return <section className="container">
        <div className="page-header" style={searchHeader}>
        </div>
        <div className="content" >
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="row">
              <input 
                type="text" 
                className="form-control"
                onChange={this._onChange}
                onKeyDown={this._keyDown}
                value={this.state.value}
              />
            </div>
            <div className="row text-center" style={searchRow}>
              <button onClick={this._save} style={searchButton} type="button" className="btn btn-default">
                Search Galactic
              </button>
              <button style={searchButton} type="button" className="btn btn-default">
                Make A Connection
              </button>
            </div>
          </div>  
        </div>
    </section>;
  },
  /**
   * @name   On Keydown Callback
   * @desc   Calls a debounced function
   */
  _keyDown: function (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  },

  /**
   * @name   On Change Callback
   * @desc   Calls a debounced function
   */
  _onChange: function (event) {
    const val = event.target.value
    this.setState({value:val})
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (event) {
    const val = this.state.value
    if (val && val.length>0){
      this.context.router.push('/search?q='+val);
    }
  }

})

module.exports = About;