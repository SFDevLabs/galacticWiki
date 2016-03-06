/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');
const LinkApi = require('../api/LinkApi');

const Actions = {

  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getList: function(start, skip, clearStore) {
    LinkApi.getEntityListData(start, skip);
    if (clearStore){
      AppDispatcher.dispatch({actionType: Constants.CLEAR_ALL_ARTICLES_DATA})
    }
  },
  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getListByTag: function(tag, start, skip, clearStore) {
    LinkApi.getEntityListData(start, skip, tag);
    if (clearStore){
      AppDispatcher.dispatch({actionType: Constants.CLEAR_ALL_ARTICLES_DATA})
    }
  },

  /**
   * @param  {string} id
   */
  getById: function(id) {
    LinkApi.getEntityDataById(id);
  },

  /**
   * @param  {obj} article data
   */
  create: function(a, b) {
    LinkApi.postEntityData(a, b);
  },

  /**
   * @param  {obj} article data
   */
  createLink: function(idOne, idTwo, textIndexFrom, pIndexFrom, textIndexTo, pIndexTo) {
    LinkApi.postEntityLinkData(idOne, idTwo, textIndexFrom, pIndexFrom, textIndexTo, pIndexTo);
  },

  /**
   * @param  {string} id
   * @param  {obj} article data
   */
  update: function(id, obj) {
    ArticleApi.putEntityData(id, obj);
  },

  /**
   * @param  {object} update
   */
  destroy: function(id) {
    LinkApi.deleteEntityData(id);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} comment data
   */
  createComment: function(articleId, obj) {
    LinkApi.postEntityCommentData(articleId, obj);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} commentId
   */
  destroyComment: function(articleId, commentId) {
    LinkApi.deleteEntityCommentData(articleId, commentId);
  }

};

module.exports = Actions;
