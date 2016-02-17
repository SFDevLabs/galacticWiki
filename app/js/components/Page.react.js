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

const SearchInput = require('./SearchInput.react');
const parse = require('url-parse');


const Loader = require('react-loader');
const _ = require('lodash');

import { Link } from 'react-router';

/**
 * Retrieve the current ARTICLES data from the ArticleStore
 */
function getState(id) {
  return {
    page: ArticleStore.getById(id),
    linkedPage: null//ArticleStore.getById(id)
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
    if (!this.state.article){
      Actions.getById(this.props.params.id);
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
    const page = this.state.page;
    const linkedPage = this.state.linkedPage;
    const linkLocation = this.state.linkLocation?this.state.linkLocation:null;
    const that = this;

    if (page===null){return <NotFound />}//null means the api gave us a 404.
    else if (!page){return <Loader />}//undefined means that no request for the article has been made.

    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="warning" />
    ) : null; //Rendering a warning message.

    const text = _.map(page.text, function(val, i){
        return <Para key={i} text={val} />
    });

    const pageClass = linkedPage?"col-md-8":"col-md-9"

    var colTwo;

    if (linkedPage) {
      const textLinked = _.map(linkedPage.text,function(val, i){
        
        return marked(val)
      });
      colTwo = (
      <div className="col-md-6">
        <div style={{marginTop:"500px"}}>{textLinked}</div>
      </div>)
    }else if (linkLocation){
      colTwo = (
      <div className="col-md-4">
        <div style={{marginTop:linkLocation+"px"}}>
          <SearchInput onSave={this._save} />
        </div>
      </div>)
    }

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

    const favicon = page.faviconCDN?<img onError={this._imgError} src={page.faviconCDN} style={{width:'16px', height:"16px", marginBottom: '2px'}} />:null;

    return <section className="container">
      {errorMessage}
      <div className="content">
        <div className="row">
 
          <div className="page-main">
            <div className="page-header">
              <h1>{page.title}</h1>
              <div className="page-link">
              {favicon}
              &nbsp;
              <a href={page.canonicalLink} target="_blank">{prettyLink}</a>
              </div>
              <p style={{color:"#999", marginBottom:"24px"}}>{page.description}</p>
              {image}
            </div>
            {text}
          </div>
          {colTwo}
        </div>
        <div>
        </div>
      </div>
    </section>;
  },

  /**
   * Event handler for 'change' events coming from the PageStore
   */
  _onChange: function() {
    const state = getState(this.props.params.id)
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
   * Event handler for 'click' events coming from the Page DOM
   */
  getSelectionText: function() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
  },
  getTextIntergerOffset: function(ptext, text){

  },
  /**
   * Event handler for 'click' events coming from the Page DOM
   */
  _save:function(url){
    console.log(url)
  }

});

module.exports = ArticleSection;
