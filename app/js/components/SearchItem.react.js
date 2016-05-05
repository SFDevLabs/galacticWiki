/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
import { Link } from 'react-router';

const connectionsStyle = {
  marginLeft: '30px'
}

const SearchItem = React.createClass({

  propTypes: {
   item: React.PropTypes.object.isRequired,
  },


  articleFactory: function(item, i){

    var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
    parser.href = item.canonicalLink;
    const host = parser.host

    return <div key={i}>
      <h3 className="overflow">
        <Link to={"/"+item._id}>
          {item.title}
        </Link>
      </h3>
      <img className="favicon" src={item.favicon}/>
      &nbsp;
      <a href={item.canonicalLink} >{host}</a>
      <p className="overflow">{item.description}</p>
    </div>
  },

  /**
   * @return {object}
   */
  render: function() {
    const that = this;
    const item = this.props.item;

    const connections = item.connections.map(function(connection, i){
      return that.articleFactory(connection, i)
    });

    return <div className="article" >
      {this.articleFactory(item)}
      <div className="connections">
        {connections}
      </div>
    </div>;
  }

});

module.exports = SearchItem;
