
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const ArticleStore = require('../stores/ArticleStore');
const NotFound = require('./NotFound.react');
const Loader = require('react-loader');
const Actions = require('../actions/ArticleActions');
const parse = require('url-parse');

const PageArticle = React.createClass({

  propTypes:{
    page: React.PropTypes.object.isRequired
  },

  render :function() {
    return <div/>
  }
})

module.exports = PageArticle;