/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var FlightInfo = require("./FlightInfo");
var FlightInfoMixin = require("./FlightInfoMixin");
var GMap = require("./GMap");

var Pilot = React.createClass({
    mixins: [FlightInfoMixin],

    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            latitude: parseFloat(localStorage["moveth:lat"]) || 51.521048,
            longitude: parseFloat(localStorage["moveth:long"] ) || 0.051374,
            online: false,
            flightId: null
        };
    },

    render: function() {
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-9">
                        <h1>movETH - Pilot
                        {' '}
                        {this.state.online ?
                            <span className="label label-success">Online</span>
                        :
                            <span className="label label-danger">Offline</span>
                        }
                        </h1>
                    </div>
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-default" onClick={this.onToClientButton}>To Client</button>
                    </div>
                </div>
                <GMap latitude={this.state.latitude} longitude={this.state.longitude} watch={true} onLocationChange={this.onLocationChange} />
                <div className="row spacer">
                    <div className="col-xs-12">
                        <div className="btn-toolbar">
                        {this.state.online ?
                            <button type="button" className="btn btn-info" onClick={this.onGoOfflineButton}>Go Offline</button>
                        :
                            <button type="button" className="btn btn-info" onClick={this.onGoOnlineButton}>Go Online</button>
                        }
                        </div>
                        <hr />
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                        <FlightInfo flight={this.state.flight} isPilot={true} onAccept={this.onAcceptButton} onReject={this.onRejectButton} onComplete={this.onCompleteButton} />
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        setInterval(this.trackLocation, this.props.trackInterval);
        this.context.client.registerPilotDisconnect();
        this.context.client.listenFlightRequests(this.onFlightRequest);
    },

    componentWillUnmount: function() {
        this.context.client.unlistenFlightRequests();
    },

    onToClientButton: function() {
        Router.transitionTo('client');
    },

    onLocationChange: function(latitude, longitude) {
        console.log("location changed", latitude, longitude);
        localStorage["moveth:lat"] = latitude;
        localStorage["moveth:long"] = longitude;
        this.setState({latitude: latitude, longitude: longitude});
        this.trackLocation();
    },

    onFlightRequest: function(flightId) {
        if (this.state.online) {
            console.log("Incoming flight request", flightId);
            this.setState({flightId: flightId});
        } else {
            console.log("Dismissing flight request since we are offline", flightId);
        }
    },

    onAcceptButton: function() {
        this.context.client.acceptFlight(this.state.flightId);
    },

    onRejectButton: function() {
        this.context.client.rejectFlight(this.state.flightId);
        this.setState({flightId: null, flight: null});
    },

    onCompleteButton: function() {
        this.context.client.completeFlight(this.state.flightId, this.state.latitude, this.state.longitude);
        this.context.client.pilotOffline(Date.now());
        Router.transitionTo('receipt', {flightId: this.state.flightId, role: 'pilot'});
    },

    onGoOnlineButton: function() {
        console.log("going online");
        this.setState({online: true});
        this.trackLocation(true);
    },

    onGoOfflineButton: function() {
        console.log("going offline");
        this.context.client.pilotOffline(Date.now());
        this.setState({online: false, flightId: null});
    },

    trackLocation: function(force) {
        if (force || this.state.online) {
            console.log("updating tracking location");
            this.context.client.trackPilotLocation(this.props.user, this.state.latitude, this.state.longitude, Date.now());
        }
    }
});

module.exports = Pilot;
