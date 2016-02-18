
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const SearchInput = require('./SearchInput.react');
const SearchItem = require('./SearchItem.react');

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

const PageSearch = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      results:[{
        title: 'ya'
      }]
    };
  },
  
  render :function() {
    const data = this.state.results;
    const length = Object.keys(data).length;

    const results = length>0?_.map(data, function(result, i) {
        return <SearchItem key={i} item={result} />
    }):
    <div>
      No Results Found.
    </div>;

    return <div className="row" style={searchRow} >
      <SearchInput onSave={this._save} />
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
  }

})

module.exports = PageSearch;