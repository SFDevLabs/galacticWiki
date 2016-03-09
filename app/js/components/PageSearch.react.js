
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchInput = require('./SearchInput.react');
const SearchItem = require('./SearchItem.react');
const PageSearchResults = require('./PageSearchResults.react');


const PageSearch = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  propTypes:{
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {};
  },
  
  render :function() {
    const q = this.state.q;
    const results = q ? <PageSearchResults 
      className= "connect-search-input"
      q= {q}
      onSelect= {this.props.onSelect} />:
      null;

    return <div>
      <SearchInput 
        onSave={this._onSearch}
        value={this.state.q}
        placeholder={'Link or Article Text'}
        autoFocus={true} />
      {results}
    </div>
  },

  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _save: function (url) {
    if (url && url.length>0){
      this.context.router.push('/search?q='+url);
    }
  },
  /**
   * @name   _onSave event from dom
   * @desc   Calls a debounced function
   */
  _onSearch: function (q) {
    this.setState({
      q:q
    });
  }

})

module.exports = PageSearch;