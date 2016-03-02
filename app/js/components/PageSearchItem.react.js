/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
import { Link } from 'react-router';

const SearchItem = React.createClass({

  propTypes: {
   item: React.PropTypes.object.isRequired,
  },

  /**
   * @return {object}
   */
  render: function() {
    const item = this.props.item;
    const overflow = {overflow: 'hidden', textOverflow: 'ellipsis'};

    var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
    parser.href = item.canonicalLink;
    const host = parser.host

    return <div className="article" >
      <h3 style={overflow} >
        <Link to={"/"+item._id}>
          {item.title}
        </Link>
      </h3>
      <img src={item.favicon}/>
      &nbsp;
      <a href={item.canonicalLink} >{host}</a>
      <p style={overflow}>{item.description}</p>
    </div>;
  }

});

module.exports = SearchItem;
