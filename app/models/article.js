'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Imager = require('imager');
const fs = require('fs');

const config = require('../../config/config');
const imagerConfig = require(config.root + '/config/imager.js');
const utils = require('../../lib/utils');
const notify = require('../mailer');
const Connection = require('../models/connection');

const Schema = mongoose.Schema;

/**
 * Article Schema
 */
const ArticleSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  keywords: {type : Array, default : []},
  html: [{type : String}],
  text: [{type : String}],
  links: [{ 
    name: {type:String}, 
    index: [{type:Number}],
    paragraphIndex: {type:Number}, 
    href: {type:String} 
  }],
  user: {type : Schema.ObjectId, ref : 'User'},
  lang: {type : String, default : '', trim : true},
  createdAt  : {type : Date, default : Date.now},
  tags: {type : Array, default : []},
  canonicalLink: {type : String, default : null},
  queryLink: {type : String, default : null},
  favicon: {type : String, default : null,},
  faviconCDN: {type : String, default : null},
  image: {type : String, default : '', trim : true},
  imageCDN: {
    url:{type : String, default : null},
    dimensions:[{type : Number, default:null}]
  },
  videos: {type : Array, default : null}
});

/**
 * Validations
 */

// ArticleSchema.path('title').required(true, 'Article title cannot be blank');
// ArticleSchema.path('text').required(true, 'Article text cannot be blank');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  const imager = new Imager(imagerConfig, 'S3');
  const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err);
  }, 'article');

  next();
});

/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  // uploadAndSave: function (images, cb) {
  //   if (!images || !images.length) return this.save(cb);

  //   const imager = new Imager(imagerConfig, 'S3');
  //   const self = this;

  //   this.validate(function (err) {
  //     if (err) return cb(err);
  //     imager.upload(images, function (err, cdnUri, files) {
  //       if (err) return cb(err);
  //       if (files.length) {
  //         console.log(err, cdnUri, files, 'cdn')
  //         self.image = { cdnUri : cdnUri, files : files };
  //       }
  //       self.save(cb);
  //     }, 'article');
  //   });
  // },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  // addComment: function (user, comment, cb) {
  //   this.comments.push({
  //     body: comment.body,
  //     user: user._id
  //   });

  //   if (this.user.email) {
  //     notify.comment({
  //       article: this,
  //       currentUser: user,
  //       comment: comment.body
  //     }, function(err, status){
  //       //no opp
  //     });
  //   }

  //   this.save(cb);
  // },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  // removeComment: function (commentId, cb) {
  //   const index = utils.indexof(this.comments, { id: commentId });
  //   if (~index) this.comments.splice(index, 1);
  //   else return cb('not found');
  //   this.save(cb);
  // }
};

/**
 * Statics
 */

ArticleSchema.statics = {

  /**
   * Find article by id [Required]
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user', 'name email username')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    const criteria = options.criteria || {};
    const lean = options.lean || false;
    this.find(criteria, 'title description faviconCDN favicon canonicalLink')
      .populate('user', 'name username')
      .populate('comments.user')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.count)
      .skip(options.skip)
      .exec(cb);
  }
};

mongoose.model('Article', ArticleSchema);
