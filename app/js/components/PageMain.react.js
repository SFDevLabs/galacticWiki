/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const React = require('react');

const ArticleActions = require('../actions/ArticleActions');

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

const PageMain = React.createClass({

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

    //Manual data entry for dev
    const data = {
      "MAIN_KEY":{"selectedParagraphIndex":0,"selectedIndex":[105,119]},
      "CONNECTED_KEY":{"selectedParagraphIndex":0,"selectedIndex":[0,100]}
    }

    this.connectedID = '572c11aed64ba8b71f05e831';
    this.setState({
      selection:data
    });
    const that= this;
    setTimeout(function(){
      ArticleActions.getById(that.connectedID);
    },500)
    //End Manual data entry for dev
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id !== this.props.params.id){
      ArticleActions.getById(nextProps.params.id);
    }
  },

  /**
   * @return {object}
   */
  render :function() {
    const that = this;
    const pageData = this.state.page;
    const connectedPageData = this.state.connectedPage;
    const selection = this.state.selection;

    const id = this.props.params.id;

    if (pageData===null){return <NotFound />}//null means the api gave us a 404.
    else if (!pageData){return <Loader />}//undefined means that no request for the article has been made.

    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="danger" />
    ) : null; //Rendering a warning message.

    const mainSelection = selection && selection[MAIN_KEY]? selection[MAIN_KEY]: null;

    const mainPage = mainSelection?
      <ReactCSSTransitionGroup 
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}
        transitionName="link"
        transitionAppearTimeout={500} >
          <a onClick={this._onCancelSelectionMain} href="javascript:void(0);"> 
            <span className="glyphicon glyphicon-arrow-left" /> back
          </a>
          <PageSelection  
            page={pageData}
            paragraph={mainSelection.selectedParagraphIndex}
          index={mainSelection.selectedIndex}/>
          <hr className="divider"/>
      </ReactCSSTransitionGroup>:
      <PageArticle
        linkId={this.state.lid}
        id={id}
        page={pageData} 
        refresh={this._refreshPage}
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

    const button = this.state.saving? 
      <div className='link-loader'><Loader /></div>:
      <button  onClick={this._save} className="btn btn-primary connect-action" >Create Link</button>;

     //&nbsp;<Loader options={{radius: 4, length:5, color: '#FFF', lines: 10, width: 3}}/>

    var connectedPage;
    if (connectedPageData && connectedSelection){
     
      connectedPage = <div>
        {button}
        <ReactCSSTransitionGroup 
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionAppear={true}
          transitionName="link"
          transitionAppearTimeout={500} >
            <a onClick={this._onCancelSearch} href="javascript:void(0);" className="pull-right cancel-search"> 
              <span className="glyphicon glyphicon-remove-circle" />
            </a>
            <PageSelection  
              page={connectedPageData}
              paragraph={connectedSelection.selectedParagraphIndex}
              index={connectedSelection.selectedIndex}/>
        </ReactCSSTransitionGroup>
      </div>;
    } else if (connectedPageData){
      connectedPage = <div>
        {button}
        <a onClick={this._onCancelSearch} href="javascript:void(0);" className="pull-right cancel-search"> 
          <span className="glyphicon glyphicon-remove-circle" />
        </a>
        <PageArticle
          id={id}
          page={connectedPageData} 
          onToolTipClick={this._onToolTipClick.bind(this, CONNECTED_KEY) } />
      </div> 
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
  _onCancelSelectionMain: function() {
    this.connectedID = null;
    this.setState({
      selection: null,
      connectedPage: undefined
    });
  },
  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onCancelSearch: function() {
    const selection = this.state.selection;
    selection[CONNECTED_KEY]=null;
    this.setState({
      selection: selection,
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
      window.scroll(0,0);      
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
  _refreshPage: function() {
    let id = this.props.params.id;
    ArticleActions.getById(id);
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onChange: function() {
    const id = this.props.params.id;
    const connectedID = this.connectedID;
    const state = getState(id, connectedID)//getState(null, this.props.params.id)//
    state.lid=this.props.params.lid;
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
    const id = this.props.params.id;
    const cId = this.connectedID;
    const data = this.state.selection;
    const selectedParagraphIndexMain = data[MAIN_KEY].selectedParagraphIndex;
    const selectedIndexMain = data[MAIN_KEY].selectedIndex;
    const selectedParagraphIndexConnected = data[CONNECTED_KEY]?data[CONNECTED_KEY].selectedParagraphIndex:null;
    const selectedIndexConnected = data[CONNECTED_KEY]?data[CONNECTED_KEY].selectedParagraphIndex:null;
    
    this.setState({
      _saving: true
    });
    //Placeholder till we figure out hwo to reset the page and ge tthe link showing
    this._onCancelSelectionMain();

    ArticleActions.createLink(
        id,
        cId,
        selectedParagraphIndexMain,
        selectedIndexMain,
        selectedParagraphIndexConnected,
        selectedIndexConnected
      );
  },

  /**
   * Event handler for 'imgError' events coming from the Page DOM
   */
  _imgError:function(e){
    e.target.remove();
  }

});

module.exports = PageMain;
