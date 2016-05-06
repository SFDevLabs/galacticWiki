
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const React = require('react');
const Messages = require('./Messages.react');
const Loader = require('react-loader');
const ArticleActions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');

const urlInputStyle = {
  margin:'40px 50px',
}

const urlActionStyle = {
  marginTop:'.5rem',
  textAlign: 'center'
}

const NewPage = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    const input = this.props.location.query.site;
    return {
      input
    };
  },

  componentDidMount: function() {
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  render :function() {
    const blankMessage = this.state._messages? (
      <Messages messages={this.state._messages} type="danger" />
      ) : null; //Rendering a warning message.
    if (this.state._saving){return <Loader />}//undefined means that no request for the article has been made.

    return <section className="container search-main">
      {blankMessage}
      <div className="row" style={urlInputStyle}>
        <input
         type="text"
         className="form-control"
         onChange={this._handleChange} 
         value={this.state.input} />
      </div>
      <div className="row" style={urlActionStyle} >
        <button onClick={this._save} className="btn btn-primary">
          Submit New Site
        </button>
      </div>
    </section>;
  },

  /**
   * Event handler for 'save' events coming from the SearchStore
   */
  _save: function(){
    this.setState({
      _messages: null,
      _saving: true
    });
    ArticleActions.create(this.state.input);
  },

  /**
   * Event handler for 'save' events coming from the SearchStore
   */
  _handleChange: function(e){
    this.setState({
      input: e.currentTarget.value
    })
  },

  /**
   * Event handler for 'save' events coming from the SearchStore
   */
  _onChange: function(e){
    const newArticleId = ArticleStore.getNewArticleId();
    const errors = ArticleStore.getErrors();

    if (newArticleId){
      this.context.router.push('/'+newArticleId);
    } else {
      this.setState({
        _messages: errors.length>0?errors:['Something went wrong'],
        _saving: false
      });
    }
  }

})

module.exports = NewPage;