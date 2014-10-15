/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var OverlayTrigger = require('react-bootstrap/OverlayTrigger');
var Tooltip = require('react-bootstrap/Tooltip');
var Button = require('react-bootstrap/Button');

var CreateAccountModal = require("./CreateAccountModal");
var Rating = require("./Rating");

var UserProfile = React.createClass({
    mixins: [FluxChildMixin],

    render: function() {
        if (!this.props.user) {
            return null;
        }

        if (!this.props.user.name) {
            return (
                <CreateAccountModal />
            );
        }

        return (
            <div>
                <OverlayTrigger placement="bottom" overlay={<Tooltip><Rating rating={this.props.user} /></Tooltip>}>
                    <Button bsStyle="default"><i className="fa fa-user"></i> {this.props.user.name}</Button>
                </OverlayTrigger>
            </div>
        );
    }
});

module.exports = UserProfile;
