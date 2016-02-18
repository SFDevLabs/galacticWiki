/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Messages = require('./Messages.react');
const Para = require('./Para.react');
const PageConnect = require('./PageConnect.react');
const PageSearch = require('./PageSearch.react');
const parse = require('url-parse');


const Loader = require('react-loader');
const _ = require('lodash');

import { Link } from 'react-router';

/**
 * Retrieve the current ARTICLES data from the ArticleStore
 */
function getState(id, lid) {
  return {
    page: ArticleStore.getById(id),
    linkedPage: ArticleStore.getById(lid)
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
      Actions.getById(this.props.params.id);
    }
    ArticleStore.addChangeListener(this._onChange);
    document.addEventListener("click", this._removePopup)
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
    document.removeEventListener("click", this._removePopup)
  },
  /**
   * @return {object}
   */
  render :function() {
    const that = this;
    const page = this.state.page;
    const linkedPage = this.state.linkedPage;

    const linkLocation = this.state.linkLocation?this.state.linkLocation:null;

    // if (page===null && ){return <NotFound />}//null means the api gave us a 404.
    // else if (!page){return <Loader />}//undefined means that no request for the article has been made.

    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="warning" />
    ) : null; //Rendering a warning message.





    var mainPage
    if ( page ) {

      const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} className="favicon" />:null;
      const text = _.map(page.text, function(val, i){
          return <Para 
            key={i} 
            _key={i}
            onDown={that._onDown}
            onUp={that._onUp}
            text={val} />
      });

      const url = parse(page.canonicalLink, true);
      const prettyLink = url.host+url.pathname;

      var image;
      if ( page.imageCDN.url ){
        const imgHeight = 700/page.imageCDN.dimensions[0]*page.imageCDN.dimensions[1]
        image = 
          <div className="page-img" style={{textAlign:'center', backgroundColor: '#eee', height:imgHeight}} >
            <img onError={this._imgError} src={page.imageCDN.url} style={{maxWidth:'100%'}} />
          </div>
      } else {
        image = 
          null
      }
      const toolTipEnable = this.state.toolTipEnable
      var toolTipStyle;
      var toolTipClass = ''
      if (toolTipEnable){
        toolTipStyle = {
          display:"block",
          top: this.toolTipPosition?this.toolTipPosition[1]-40:null,
          left: this.toolTipPosition?this.toolTipPosition[0]-30:null,//'calc(50% - 150px)',
        }
        toolTipClass += 'in'
      } else{
        toolTipStyle = {
          display:'block',
          top:'-100px'
        }
      }

      mainPage = <div className="row">
        <div className="page-main">
          <div className="header">
            <h1>{page.title}</h1>
            <div className="page-link">
              {favicon}
              &nbsp;
              <a href={page.canonicalLink} target="_blank">{prettyLink}</a>
            </div>
            <p style={{color:"#999", marginBottom:"24px"}}>{page.description}</p>
            {image}
          </div>
          <div className="page-text">
            {text}
          </div>
        </div>
        <div style={toolTipStyle} className={"popover fade top "+toolTipClass}>
          <div className="arrow arrow-link"></div>
          <div className="btn-group">
            <button onClick={this._createLink} style={{width:'100px'}} className="btn btn-primary">
              <span className="glyphicon glyphicon-link" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    } else {
      mainPage = <PageSearch />
    }

   // <button style={searchButton} type="button" className="btn btn-default">
  //  Make A Connection
  //</button>
    
    const pageConnect = linkedPage?<PageConnect page={linkedPage} />:null;

    return <section className="container ease">
      {errorMessage}
      <div className="content main">
        {pageConnect}
        <div className="row connect-action" style={{display:'none'}}>
          <a style={{width:'300px', margin: 'auto', fontSize:'2rem'}} className="btn btn-default" > Create Link </a>
        </div>
        {mainPage}
      </div>
    </section>



  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onChange: function() {
    const state = getState(this.props.params.id)//getState(null, this.props.params.id)//
    const errors = ArticleStore.getErrors()
    if (errors.length>0) { //Errors from page action need to be displayed.
      this.setState({
        _messages: errors,
        _deleting: false
      });
    } else if (!state.article && this.state._deleting) { //A delete request was fired, we have no errors and we have no article in the store. Navigate to home.
      this.context.router.push('/');
    } else {
      this.setState(state);
    }
  },
  /**
   * Event handler for 'imgError' events coming from the Page DOM
   */
  _imgError:function(e){
    e.target.remove();//
  },
  /**
   * Event handler for 'mouse up' events coming from the Page DOM
   */
  _onDown: function(e, key){
    this._key=key;
    this.toolTipPosition = [e.pageX, e.pageY]
  },
  /**
   * Event handler for 'mouse up' events coming from the Page DOM
   */
  _onUp: function(e, key){
    if (this._key !== key){return} //bonk out
    const that = this;
    if (this.toolTipPosition[1] > e.pageY){
      this.toolTipPosition=[e.pageX, e.pageY, ]
    }
    setTimeout(function(){
      const text = that._getSelectionText();
        that.setState({
          toolTipEnable: text.length>0
        })
    }, 10)
  },
  /**
   * Event handler for 'click' events coming from the Page DOM
   */
  _getSelectionText: function() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
  },
  /**
   * Event handler for 'click' events coming from the Page DOM
   */
  _removePopup: function(e){
    const classMain = 'page-text'
    const main = this._closest(e.target, '.'+classMain);
    if (this.state.toolTipEnable && main===null && e.target.className.indexOf(classMain)===-1 ){
      this.setState({
        toolTipEnable: false
      });
    }
  },
  /**
   * Event handler for 'link' events coming from the Page DOM
   */
  _createLink: function(e){
    const text = this._getSelectionText();
    if (text.length && this._key){
      //Actions.setHighlight(text, this._key)
    }
    this.setState(getState(null, this.props.params.id))
  },

  _closest: function(el, selector) {
    var matchesFn;
    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })
    // traverse parents
    while (el!==null) {
        parent = el.parentElement;
        if (parent!==null && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }
    return null;
}

});

module.exports = ArticleSection;
