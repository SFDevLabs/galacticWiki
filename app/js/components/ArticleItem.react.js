/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const _ = require('lodash');
import { Link } from 'react-router';

const ArticleItem = React.createClass({

  propTypes: {
   article: React.PropTypes.object.isRequired,
  },

  /**
   * @return {object}
   */
  render: function() {
    const article = this.props.article;
    const overflow = {overflow: 'hidden', textOverflow: 'ellipsis'};

    var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
    parser.href = article.canonicalLink;
    const host = parser.host

    return <div className="article" >
      <h3 style={overflow} >
        <Link to={"/articles/"+article._id}>
          {article.title}
        </Link>
      </h3>
      <img src={article.favicon}/>
      &nbsp;
      <a href={article.canonicalLink} >{host}</a>

      <p style={overflow}>{article.description}</p>

    </div>;
  }

});

module.exports = ArticleItem;
