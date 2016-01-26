/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const Constants = require('../constants/Constants');
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

var _results = {};
var _total = null;
var _didInitalGet = false;
var _errors = [];
var _url = null;
/**
 * Set all ARTICLE item.
 * @param  {string} text The content of the ARTICLES
 */
function setAll(articles) {
  for (var i = articles.length - 1; i >= 0; i--) {
    var article = articles[i]
    var id = article._id
    _results[id] = article;
  };
}

/**
 * Set one ARTICLE item.
 * @param  {string} text The content of the ARTICLES
 */
function setURL(url) {
  _url = url;
}



/**
 * Delete all ARTICLES items.
 * @param  {string} id
 */
function destroyAll(id) {
  _articles={};
}


/**
 * Set total count
 * @param  {number} the total number of articles
 */
function setTotal(num) {
  _total = num;
}

/**
 * Set error message
 * @param  {error} the errors from the server
 */
function setError(error) {
  _errors = error;
}



var SearchStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of ARTICLEs.
   * @return {object}
   */
  getAll: function() {
    return _results;
  },

  /**
   * Get total number of ARTICLEs.
   * @return {number}
   */
  getTotal: function() {
    return _total;
  },
  

  /**
   * Get the entire collection of ARTICLEs.
   * @return {object}
   */
  getErrors: function() {
    var err = _errors;
    _errors = [];
    return err;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case Constants.GET_SEARCH_DATA:
      const results = action.response.body.results
      const url = action.response.body.url
      const total = action.response.body.total
      if (results) {
        _didInitalGet = true;
        setAll(results);
        setTotal(total);
      } else if (url) {
        setURL(url)
      }
      ArticleStore.emitChange();
      break;

    case Constants.CLEAR_SEARCH_DATA:
      destroyAll(articles);
      break;



    case Constants.ERROR:
      var errors = action.response.errors
      if (errors) {
        setError(errors);
        ArticleStore.emitChange();
      }
      break;
      

    case Constants.TIMEOUT:
      setError(['The Request Timed Out']);
      ArticleStore.emitChange();
      break;

    default:
      // no operation
  }
});

module.exports = SearchStore;
