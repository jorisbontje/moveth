/** @jsx React.DOM */

var React = require("react");
var OverlayTrigger = require('react-bootstrap/OverlayTrigger');
var Tooltip = require('react-bootstrap/Tooltip');
var Button = require('react-bootstrap/Button');

var CreateAccountModal = require("./CreateAccountModal");
var Rating = require("./Rating");

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
                <OverlayTrigger placement="bottom" overlay={<Tooltip><Rating rating={this.state.user} /></Tooltip>}>
                    <Button bsStyle="default"><i className="fa fa-user"></i> {this.state.user.name}</Button>
                </OverlayTrigger>
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
