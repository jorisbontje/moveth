/** @jsx React.DOM */

var React = require("react");

var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');

var constants = require("../constants");

var CreateAccountModal = React.createClass({

    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            userName: ''
        };
    },

    handleHide: function() {
        // will hide when the account is created
    },

    render: function() {
        return this.transferPropsTo(
            <Modal title="Create Account" animation={false} closeButton={false} onRequestHide={this.handleHide}>
                <form onSubmit={this.handleSave}>
                    <div className="modal-body">
                        <p>What is the name for your movETH account?</p>
                        <input type="text" className="form-control" placeholder="name" pattern={constants.VALID_USERNAME_PATTERN} value={this.state.userName} onChange={this.onNameChange} />
                        <span className="help-block">Pick a nickname or email address that you want to be publically associated with. Maximum length is 32 characters, lower case only.</span>
                    </div>
                    <div className="modal-footer">
                        <Button type="submit" bsStyle="primary">Create Account</Button>
                    </div>
                </form>
            </Modal>
        );
    },

    onNameChange: function(e) {
        this.setState({userName: e.target.value.trim().toLowerCase()});
    },

    handleSave: function(e) {
        e.preventDefault();
        var name = this.state.userName.trim().toLowerCase();

        if (!name) {
            return;
        }

        this.context.client.setUserName(name);
        this.setState({userName: ''});
    }
});

module.exports = CreateAccountModal;
