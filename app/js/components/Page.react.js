/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Messages = require('./Messages.react');

const Loader = require('react-loader');
const _ = require('lodash');

import { Link } from 'react-router';

/**
 * Retrieve the current ARTICLES data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
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
    if (this.state.article===null){return <NotFound />}//null means the api gave us a 404.
    else if (!this.state.article){return <Loader />}//undefined means that no request for the article has been made.


    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();             
    const deleting = this.state._deleting ? <Loader options={{top:'10%'}} />:null; //The loader itself.


    const errorMessage = this.state._messages? (
     <Messages messages={this.state._messages} type="warning" />
    ) : null; //Rendering a warning message.

    const text = _.map(article.text,function(val, i){
      return <p key={i} >{val}</p>
    });


    return <section className="container">
      <div className="page-header">
        <button onClick={this._onRefresh} className="pull-right btn btn-default">
          <span className="glyphicon glyphicon-refresh"></span>
        </button>
        <h1>{article.title}</h1>
      </div>
      {errorMessage}
      <div className="content">
        <div className="row">
          <div className="col-md-6">
            {text}
          </div>
        </div>
        <div>
        </div>
      </div>
    </section>;
  },

  /**
   * Event handler for 'change' events coming from the ArticleStore
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

  _onRefresh:function(){
    Actions.getById(this.props.params.id);
    this.setState({
      article:undefined
    });
  }

});

module.exports = ArticleSection;
