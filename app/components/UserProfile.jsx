/** @jsx React.DOM */

var React = require("react");

var CreateAccountModal = require("./CreateAccountModal");

var UserProfile = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            user: null
        };
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }

        if (!this.state.user.name) {
            return (
                <CreateAccountModal />
            );
        }

        return (
            <div>
                <i className="fa fa-user"></i> {this.state.user.name}
            </div>
        );
    },

    componentDidMount: function() {
        this.context.client.listenUserProfile(this.onUserProfile);
    },

    componentWillUnmount: function() {
        this.context.client.unlistenUserProfile();
    },

    onUserProfile: function(user) {
        this.setState({user: user});
    }
});

module.exports = UserProfile;
