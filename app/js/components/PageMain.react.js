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
const ToolTip = require('./ToolTip.react');

const PageSearch = require('./PageSearch.react');
const parse = require('url-parse');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');


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
    document.addEventListener("mousedown", this._screenMousedown)
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
    document.removeEventListener("click", this._screenMousedown)
  },
  /**
   * @return {object}
   */
  render :function() {
    const that = this;
    const page = this.state.page;
    const linkedPage = this.state.linkedPage;

    const linkLocation = this.state.linkLocation?this.state.linkLocation:null;

    // if (page===null){return <NotFound />}//null means the api gave us a 404.
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
            text={val}
            tags={_.filter(page.links,{paragraphIndex:i})} />
      });

      const url = parse(page.canonicalLink, true);
      const prettyLink = url.host+url.pathname;

      var image;
      if ( page.imageCDN.url ){
        const imgHeight = 700<page.imageCDN.dimensions[0]?
          700/page.imageCDN.dimensions[0]*page.imageCDN.dimensions[1]:
          page.imageCDN.dimensions[1];

      image = 
        <div className="page-img" style={{height:imgHeight}} >
          <img onError={this._imgError} src={page.imageCDN.url} style={{maxWidth:'100%'}} />
        </div>
      } else {
        image = 
          null
      }

      const location = this.state.selectionLocation;
      const toolTip = location ?<ToolTip location={location} />:null;

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
            <ReactCSSTransitionGroup transitionAppear={true} transitionName="fall" transitionAppearTimeout={200} transitionEnterTimeout={200} transitionLeaveTimeout={1} >
              {toolTip}
            </ReactCSSTransitionGroup>
            {text}
          </div>
        </div>
      </div>
      } else {
        mainPage = <PageSearch />
      }
      
      const pageConnect = linkedPage?<PageConnect page={linkedPage} />:null;
      return <div>
        <section className="container ease">
          {errorMessage}
          <div className="content main">
            <button onClick={this._createLink} type="button" className="btn btn-default">
            </button>
            <ReactCSSTransitionGroup transitionAppear={true} transitionName="fall" transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500} >
              {pageConnect}
            </ReactCSSTransitionGroup>
            <div className="row connect-action" style={{display:'none'}}>
              <a style={{width:'300px', margin: 'auto', fontSize:'2rem'}} className="btn btn-default" > Create Link </a>
            </div>
            {mainPage}
          </div>
        </section>
      </div>
  },
  /**
   * Event handler for 'change' events coming from the Paragraph
   */
  _onUp: function(selectedText, start, end){
      const that = this;
      setTimeout(function(){
        if (selectedText.length){
          console.log(start, end);
          that.setState({
            selectionLocation: that._calculatePageCoords()
          })   
        }
      }, 1);
  },
  /**
   * Event handler for 'change' events coming from the Paragraph
   */
  _onDown: function(){


  },
  /**
   * Event handler for 'change' events coming from the Paragraph
   */

  _screenMousedown: function(){
      this.setState({
        selectionLocation: null
      })
  },
  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onChange: function() {
    const state = getState(this.props.params.id)//getState(null, this.props.params.id)//
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
   * Event handler for 'imgError' events coming from the Page DOM
   */
  _imgError:function(e){
    e.target.remove();//
  },
  _calculatePageCoords: function(){
    const coords = this._getSelectionCoords()
    const x = coords.x + document.body.scrollLeft;
    const y = coords.y + document.body.scrollTop;
    return [x, y]
  },
   /**
   * Event handler for 'imgError' events coming from the Page DOM
   */ 
  _getSelectionCoords: function() {
    var win = win || window;
    var doc = win.document;
    var sel = doc.selection, range, rects, rect;
    var x = 0, y = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                x = rect.left;
                y = rect.top;
            }
            // Fall back to inserting a temporary element
            if (x == 0 && y == 0) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    // Ensure span has dimensions and position by
                    // adding a zero-width space character
                    span.appendChild( doc.createTextNode("\u200b") );
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);

                    // Glue any broken text nodes back together
                    spanParent.normalize();
                }
            }
        }
    }
    return { x: x, y: y };
  }

});

module.exports = ArticleSection;
