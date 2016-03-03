
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const SearchInput = require('./SearchInput.react');
const PageSearchResults = require('./PageSearchResults.react');

const PageConnect = React.createClass({

  propTypes:{
    page: React.PropTypes.object.isRequired,
    paragraph: React.PropTypes.number.isRequired,
    index: React.PropTypes.array.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {}; 
  },

  render :function() {
    const page = this.props.page;
    const paragraph = page.text[this.props.paragraph];

    const index = this.props.index;

    const beforeText = paragraph.slice(0, index[0]);
    const afterText = paragraph.slice(index[1]);
    const selectedText = paragraph.slice(index[0], index[1]);
    
    const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} style={{width:'16px', height:"16px", marginBottom: '2px'}} />:null;

    const q = this.state.q;
    const results = q ? <PageSearchResults className="connect-search-input" q={q} onSelect={this.props.onSelect} />:null;

    return <ReactCSSTransitionGroup 
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}
        transitionName="link"
        transitionAppearTimeout={500} >
      <div className="row">
        <div className="connect-main">
          <div className="header">
            <a onClick={this.props.onCancel} href="javascript:void(0);"> 
              <span className="glyphicon glyphicon-arrow-left" /> back
            </a>
            <h2>
              {favicon}
              &nbsp;
              {page.title} 
              &nbsp;
              <a href={page.canonicalLink} target="_blank">
                <span style={{fontSize:'1.2rem'}} className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
              </a> 
            </h2>
          </div>
          <div>
            <p className="connect-surrounding-text" style={{borderBottom: '1px solid #eee'}}>
              {beforeText}
              <a className="link-text" href="javascript:void(0);" >{selectedText}</a>
              {afterText}
            </p>
          </div>
          <SearchInput 
            onSave={this._onSearch}
            value={this.state.q}
          />
          {results}
        </div>
      </div>
    </ReactCSSTransitionGroup>
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

module.exports = PageConnect;