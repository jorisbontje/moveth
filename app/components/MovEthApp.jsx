/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var UserProfile = require("./UserProfile");

var MovEthApp = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("RadarStore", "UserStore")],

    childContextTypes: {
        client: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            client: this.props.client
        };
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return {
            radar: flux.store("RadarStore").getState(),
            user: flux.store("UserStore").getState()
        };
    },

    render: function() {
        return (
            <div>
                <UserProfile user={this.state.user.currentUser} />
                <this.props.activeRouteHandler radar={this.state.radar} user={this.state.user.currentUser} />
            </div>
        );
    },

    componentDidMount: function() {
        this.getFlux().actions.user.loadCurrentUser(this.props.client.UID());
    },

    componentWillUnmount: function() {
        this.getFlux().actions.user.unloadCurrentUser();
    },
});

module.exports = MovEthApp;
