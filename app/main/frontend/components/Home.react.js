/**
 * @jsx Home.react
 */
"use strict";

var React = require('react');

var Home = React.createClass({
  render: function () {
    return <div className="mainBody">
      <div className="row sixteen logoArea">
        <span className="columns four"><img src="/img/blank.png" /></span>
        <span className="columns eight mainLogo"><img src="/img/logo_clustr.png" /></span>
        <span className="columns four"><img src="/img/blank.png" /></span>
      </div>

      <div className="row sixteen searchArea">
        <span className="columns four"><img src="/img/blank.png" /></span>
        <span className="columns eight">
          <form className = "queryForm">
            <input className="queryBox" type="text" name="query" placeholder="enter URL" />
            <input className="querySubmit" type="submit" value="Search" />
          </form>
        </span>
        <span className="columns four"><img src="/img/blank.png" /></span>
      </div>
    </div>
  }
});
module.exports = Home;