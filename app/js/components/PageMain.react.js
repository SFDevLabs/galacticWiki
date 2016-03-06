/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const React = require('react');

const ArticleActions = require('../actions/ArticleActions');
const LinkActions = require('../actions/LinkActions');

const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Messages = require('./Messages.react');
const PageSelection = require('./PageSelection.react');
const PageSearch = require('./PageSearch.react');
const PageArticle = require('./PageArticle.react');
const ToolTip = require('./ToolTip.react');

const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const parse = require('url-parse');
const Loader = require('react-loader');

const MAIN_KEY ='MAIN_KEY';
const CONNECTED_KEY ='CONNECTED_KEY';

import { Link } from 'react-router';

/**
 * Retrieve the current ARTICLES data from the ArticleStore
 */
function getState(id, Cid) {
  return {
    page: ArticleStore.getById(id),
    connectedPage: ArticleStore.getById(Cid)
  };
}

const ArticleSection = React.createClass({

  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return getState(this.props.params.id); //Using the antipattern to pass the id from the URL
  },

  componentDidMount: function() {
    if (!this.state.page){
      ArticleActions.getById(this.props.params.id);
    }
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render :function() {
    const that = this;
    const pageData = this.state.page;
    const connectedPageData = this.state.connectedPage;
    const selection = this.state.selection;

    if (pageData===null){return <NotFound />}//null means the api gave us a 404.
    else if (!pageData){return <Loader />}//undefined means that no request for the article has been made.

    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="warning" />
    ) : null; //Rendering a warning message.

    const mainSelection = selection && selection[MAIN_KEY]? selection[MAIN_KEY]: null;

    const mainPage = mainSelection?
      <ReactCSSTransitionGroup 
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}
        transitionName="link"
        transitionAppearTimeout={500} >
          <a onClick={this._onCancelClick} href="javascript:void(0);"> 
            <span className="glyphicon glyphicon-arrow-left" /> back
          </a>
          <PageSelection  
            page={pageData}
            paragraph={mainSelection.selectedParagraphIndex}
          index={mainSelection.selectedIndex}/>
          <hr className="divider"/>
      </ReactCSSTransitionGroup>:

      <PageArticle 
        page={pageData} 
        onToolTipClick={this._onToolTipClick.bind(this, MAIN_KEY)} />;

    const pageSearch = mainSelection && connectedPageData===undefined?
      <ReactCSSTransitionGroup 
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}
        transitionName="link"
        transitionAppearTimeout={500} >
        <PageSearch className="page-search" onSelect={this._onSelectLinkedPage} />      
      </ReactCSSTransitionGroup>:
      null;

    const connectedSelection = selection && selection[CONNECTED_KEY]? selection[CONNECTED_KEY]: null;

    var connectedPage;
    if (connectedPageData && connectedSelection){
      connectedPage = <ReactCSSTransitionGroup 
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}
        transitionName="link"
        transitionAppearTimeout={500} >
          <PageSelection  
            page={connectedPageData}
            paragraph={connectedSelection.selectedParagraphIndex}
            index={connectedSelection.selectedIndex}/>
        <button  onClick={this._save} className="btn btn-default" >Connect</button>
      </ReactCSSTransitionGroup>;
    } else if (connectedPageData){
      connectedPage = <PageArticle 
        page={connectedPageData} 
        onToolTipClick={this._onToolTipClick.bind(this, CONNECTED_KEY) } />
    }

    return <div>
      <section className="container">
        {errorMessage}
        <div className="content main">
          {mainPage}
          {pageSearch}
          {connectedPage}
        </div>
      </section>
    </div>
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onCancelClick: function(data) {
    this.connectedID = null;
    this.setState({
      selection: null,
      connectedPage: undefined
    });
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onToolTipClick: function(key ,selectedParagraphIndex, selectedIndex) {
    var data = this.state.selection || {};
    data[key]={};
    data[key].selectedParagraphIndex = selectedParagraphIndex;
    data[key].selectedIndex = selectedIndex;

    if (key==CONNECTED_KEY){
      window.scroll(0,0)      
    }

    this.setState({
      selection: data
    });
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onSelectLinkedPage: function(id) {
    this.connectedID = id;
    ArticleActions.getById(id);
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onChange: function() {
    const id = this.props.params.id;
    const connectedID = this.connectedID;
    const state = getState(id, connectedID)//getState(null, this.props.params.id)//
    const errors = ArticleStore.getErrors()
    if (errors.length>0) { //Errors from page action need to be displayed.
      this.setState({
        _messages: errors
      });
    } else {
      this.setState(state);
    }
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _save: function() {
    LinkActions.create('jeff', 'jeff2');
  },

  /**
   * Event handler for 'imgError' events coming from the Page DOM
   */
  _imgError:function(e){
    e.target.remove();
  }

});

module.exports = ArticleSection;
