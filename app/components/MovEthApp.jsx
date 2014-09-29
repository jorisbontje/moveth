/** @jsx React.DOM */

var React = require("react");

var MovEthApp = React.createClass({

    childContextTypes: {
        client: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            client: this.props.client
        };
    },

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
