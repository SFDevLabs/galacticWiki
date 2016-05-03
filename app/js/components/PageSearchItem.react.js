/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
import { Link } from 'react-router';

const SearchItem = React.createClass({

  propTypes: {
   item: React.PropTypes.object.isRequired,
   onSelect: React.PropTypes.func.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    const item = this.props.item;
    const overflow = {overflow: 'hidden', textOverflow: 'ellipsis', 'lineHeight':'3rem'};

    var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
    parser.href = item.canonicalLink;
    const host = parser.host

    return <div className="article" >
      <h3 style={overflow} >
        <a onClick={this._onClick} to={"/"+item._id} href="javascript:void(0);" >
          {item.title}
        </a>
      </h3>
      <img className="favicon" src={item.favicon}/>
      &nbsp;
      <a href={item.canonicalLink} >{host}</a>
      <p style={overflow}>{item.description}</p>
    </div>;
  },
  _onClick: function() {
    this.props.onSelect(this.props.item._id);
  }
});

module.exports = SearchItem;
