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

    var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
    parser.href = item.canonicalLink;
    const host = parser.host


    const titles = item.connections.map(function(connection, i){
      return <h4 style={{marginLeft:'40px'}} >{connection.title}</h4>
    });

    return <div className="article" >
      <h3 className="overflow" style={{lineHeight:'2.7rem'}} >
        <Link to={"/"+item._id}>
          {item.title}
        </Link>
      </h3>
      <img className="favicon" src={item.favicon}/>
      &nbsp;
      <a href={item.canonicalLink} >{host}</a>
      <p className="overflow">{item.description}</p>

      {titles}
    </div>;
  }

});

module.exports = SearchItem;
