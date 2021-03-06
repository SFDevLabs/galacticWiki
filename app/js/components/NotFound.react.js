
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Link } from 'react-router';

const About = React.createClass({
  render :function() {
    return <section className="container">
      <div className="row">
        <div className="page-header">
          <h2>404 - Not Found</h2>
        </div>
        <div className="content" >
          <p>We could not find that page.</p>
          <Link to="/">Return Home</Link>
        </div>
      </div>
    </section>;
  }
})

module.exports = About;