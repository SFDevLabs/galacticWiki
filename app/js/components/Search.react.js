
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchInput = require('./SearchInput.react');
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
              <SearchInput 
                onSave={this._save}
              />
            </div>
            <div className="row text-center" style={searchRow}>
              <button style={searchButton} type="button" className="btn btn-default">
                Make A Connection
              </button>
            </div>
          </div>  
        </div>
    </section>;
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (url) {
    if (url && url.length>0){
      this.context.router.push('/search?q='+url);
    }
  }

})

module.exports = About;