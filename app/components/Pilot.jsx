/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var GMap = require("./GMap");

var FlightInfo= React.createClass({
    render: function() {
        return (
            <div>
            <h2>Flight Info</h2>
            id={this.props.flight.id}
            {' '}
            Pickup latitude={this.props.flight.latitude} longitude={this.props.flight.longitude}
            </div>
        );
    }
});

var Pilot = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            latitude: parseFloat(localStorage["moveth:lat"]) || 51.521048,
            longitude: parseFloat(localStorage["moveth:long"] ) || 0.051374,
            online: false,
            flightId: null,
            flight: null
        };
    },

    render: function() {
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-10">
                        <h1>movETH - Pilot
                        {' '}
                        {this.state.online ?
                            <span className="label label-success">Online</span>
                        :
                            <span className="label label-danger">Offline</span>
                        }
                        </h1>
                    </div>
                    <div className="col-xs-2">
                        <button type="button" className="btn btn-default" onClick={this.onToClient}>To Client</button>
                    </div>
                </div>
                <GMap latitude={this.state.latitude} longitude={this.state.longitude} watch={true}
                      width={500} height={500} zoom={15} onLocationChange={this.onLocationChange} />
                <div className="row">
                    <div className="col-xs-12">
                        {this.state.online ?
                            <button type="button" className="btn btn-info" onClick={this.onGoOffline}>Go Offline</button>
                        :
                            <button type="button" className="btn btn-info" onClick={this.onGoOnline}>Go Online</button>
                        }
                        <hr />
                        <p>UID: {this.context.client.UID()}</p>
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                        {this.state.flight && <FlightInfo flight={this.state.flight} />}
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
        if (this.state.flightId) {
            this.context.client.unlistenFlightInfo(this.state.flightId);
        }
    },

    onToClient: function() {
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
            this.context.client.listenFlightInfo(flightId, this.onFlightInfo);
        } else {
            console.log("Dismissing flight request since we are offline", flightId);
        }
    },

    onFlightInfo: function(flight) {
        this.setState({flight: flight});
    },

    onGoOnline: function() {
        console.log("going online");
        this.setState({online: true});
        this.trackLocation(true);
    },

    onGoOffline: function() {
        console.log("going offline");
        this.context.client.pilotOffline(Date.now());
        if (this.state.flightId) {
            this.context.client.unlistenFlightInfo(this.state.flightId);
        }
        this.setState({online: false, flightId: null, flight: null});
    },

    trackLocation: function(force) {
        if (force || this.state.online) {
            console.log("updating tracking location");
            this.context.client.trackPilotLocation(this.state.latitude, this.state.longitude, Date.now());
        }
    }
});

module.exports = Pilot;
