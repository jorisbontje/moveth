/** @jsx React.DOM */

var React = require("react");

var UserProfile = require("./UserProfile");

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
                <UserProfile />
                <this.props.activeRouteHandler />
            </div>
        );
    },

    componentDidMount: function() {
        // TODO load / init
    },
});

module.exports = MovEthApp;
