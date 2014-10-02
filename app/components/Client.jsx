/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var utils = require("../utils");
var GMap = require("./GMap");
var PilotFinder = require("./PilotFinder");

var Client = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            latitude: parseFloat(localStorage["moveth:lat"]) || 51.521048,
            longitude: parseFloat(localStorage["moveth:long"] ) || 0.051374,
            address: localStorage["moveth:address"] || "69-89 Mile End Rd, London E1 4UJ, UK",
            confirmation: false
        };
    },

    render: function() {
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-9">
                        <h1>{this.state.confirmation ? 'CONFIRMATION' : 'movETH' }</h1>
                    </div>
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-default" onClick={this.onToPilot}>To Pilot</button>
                    </div>
                </div>
                <GMap latitude={this.state.latitude} longitude={this.state.longitude} address={this.state.address} showAddress={true} watch={true}
                      onLocationChange={this.onLocationChange} onAddressChange={this.onAddressChange} />
                <div className="row">
                    <div className="col-xs-12">
                        <PilotFinder latitude={this.state.latitude} longitude={this.state.longitude} showSummary={true} />
                        {this.state.confirmation ?
                            <div>
                                <button type="button" className="btn btn-success" onClick={this.onConfirm}>Confirm Airlift</button>
                                <button type="button" className="btn btn-default" onClick={this.onCancel}>Cancel</button>
                            </div>
                            :
                            <button type="button" className="btn btn-info" onClick={this.onRequest}>Request Airlift</button>
                        }
                        <hr />
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                    </div>
                </div>
            </div>
        );
    },

    onToPilot: function() {
        Router.transitionTo('pilot');
    },

    onLocationChange: function(latitude, longitude) {
        if (!this.state.confirmation) {
            localStorage["moveth:lat"] = latitude;
            localStorage["moveth:long"] = longitude;
            this.setState({latitude: latitude, longitude: longitude});
        }
    },

    onAddressChange: function(address) {
        if (!this.state.confirmation) {
            localStorage["moveth:address"] = address;
            this.setState({address: address});
        }
    },

    onRequest: function() {
        this.setState({confirmation: true});
    },

    onConfirm: function() {
        console.log("confirmed");
        var flightId = utils.randomId();
        this.context.client.registerFlight(flightId, this.state.latitude, this.state.longitude);
        Router.transitionTo('inFlight', {latitude: this.state.latitude, longitude: this.state.longitude, address: this.state.address, flightId: flightId});
    },

    onCancel: function() {
        this.setState({confirmation: false});
    },
});

module.exports = Client;
