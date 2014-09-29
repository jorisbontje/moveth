/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var utils = require("../utils");
var GMap = require("./GMap");

var ConfirmRequest = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    render: function() {
        var latitude = parseFloat(this.props.params.latitude);
        var longitude = parseFloat(this.props.params.longitude);

        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>CONFIRMATION</h1>
                    </div>
                </div>
                <GMap latitude={latitude} longitude={longitude} address={this.props.params.address} showAddress={true}
                      width={500} height={500} zoom={15} />
                <div className="row">
                    <div className="col-xs-12">
                        <p>Pick up time is approximately X min.</p>
                        <button type="button" className="btn btn-success" onClick={this.onConfirm}>Confirm Airlift</button>
                        <button type="button" className="btn btn-default" onClick={this.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    },

    onConfirm: function() {
        console.log("confirmed");
        var flightId = utils.randomId();
        this.context.client.registerFlight(flightId, parseFloat(this.props.params.latitude), parseFloat(this.props.params.longitude));
        Router.transitionTo('inFlight', {latitude: this.props.params.latitude, longitude: this.props.params.longitude, address: this.props.params.address, flightId: flightId});
    },

    onCancel: function() {
        Router.transitionTo('client');
    },
});

module.exports = ConfirmRequest;
