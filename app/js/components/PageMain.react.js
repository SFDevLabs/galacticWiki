/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Messages = require('./Messages.react');
const PageConnect = require('./PageConnect.react');
const PageArticle = require('./PageArticle.react');
const ToolTip = require('./ToolTip.react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const PageSearch = require('./PageSearch.react');
const parse = require('url-parse');

const Loader = require('react-loader');

const Utils = require('../lib/domUtility');
const closest = Utils.closest;
const getSelectionCoords = Utils.getSelectionCoords;

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
    document.removeEventListener("mousedown", this._screenMousedown)

  },

  /**
   * @return {object}
   */
  render :function() {
    const that = this;
    const page = this.state.page;
    const linkedPage = this.state.linkedPage;

    const linkLocation = this.state.linkLocation?this.state.linkLocation:null;

    if (page===null){return <NotFound />}//null means the api gave us a 404.
    else if (!page){return <Loader />}//undefined means that no request for the article has been made.

    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="warning" />
    ) : null; //Rendering a warning message.

    const location = this.state.selectionLocation;
    const toolTip = location ?
      <ToolTip 
        location={location} 
        onClick={this._onToolTipClick}
        />:
      null;

      var mainPage
      if ( this.state.linkMode ) {
        mainPage = <PageConnect  page={page} paragraph={this.selectedParagraphIndex} index={this.selectedIndex}  onCancel={this._onCancelClick} />
      } else {
        mainPage = <PageArticle onSelectionClick={this._onClick} page={page} onUp={this._onUp} />;
      }
      
    // const pageConnect = linkedPage?<PageConnect page={linkedPage} />:null;


    return <div>
      <section className="container ease">
        {errorMessage}
        <div className="content main">
          {mainPage}
          {toolTip}
        </div>
      </section>
    </div>
  },
  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onCancelClick: function(data) {
    this.setState({
      linkMode: false
    });
  },
  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onToolTipClick: function(data) {
    this.setState({
      linkMode: true,
      selectionLocation: null
    });
  },
  /**
   * Event handler for 'change' events coming from the Paragraph
  */
  _onUp: function(paragraphIndex, start, end, ){
      const that = this;
      this.selectedParagraphIndex = paragraphIndex;
      this.selectedIndex = [start, end];
      setTimeout(function(){
        that.setState({
          selectionLocation: getSelectionCoords() // wee use the timeout to make sure the dom has time register the selection 
        });
      }, 1); //See timout comment above.
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
  /**
  * Event handler for 'change' events coming from the Paragraph
  */
  _screenMousedown: function(e){
    const toolTip = closest(e.target, '.popover');
    if (toolTip==null && this.state.selectionLocation !== null) {
      this.setState({
        selectionLocation: null
      });
    }
  }

});

module.exports = ArticleSection;
