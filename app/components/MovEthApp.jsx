/** @jsx React.DOM */

var React = require("react");

var MovEthApp = React.createClass({
  render: function() {
    return (
      <div>
        <this.props.activeRouteHandler />
      </div>
    );
  },

  componentDidMount: function() {
      // TODO load / init
  },
});

module.exports = MovEthApp;
