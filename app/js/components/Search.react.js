
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchInput = require('./SearchInput.react');
const SearchResults = require('./SearchResults.react');

const Search = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {};
  },

  // componentWillMount: function() {
  //   const q = this.location.query.q;
  //   const clearData = true;
  //   fetch(q, clearData)
  // },
  
  componentWillReceiveProps: function(newProps){
    const q = newProps.location.query.q;
    console.log
  },

  render :function() {

     const q = this.props.location.query.q
     const seachMain = q ?
     <SearchResults q={q} />: //Give the search result with the q
     <div className="container"> 
      <div className="row search-input">
        <SearchInput 
          onSave={this._save}
        />
      </div>
      <div className="row text-center search-actions">
        <button type="button" className="btn btn-default">
          Make A Connection
        </button>
      </div>
    </div>;//Give the static search bar.

    return <section className="container search-main">
      {seachMain}
    </section>;
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (url) {
    if (url && url.length>0){
      this.context.router.push('/?q='+url);
    }
  }

})

module.exports = Search;