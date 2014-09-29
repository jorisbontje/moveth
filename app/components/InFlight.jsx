/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var geolib = require("geolib");
var _ = require("lodash");

var GMap = require("./GMap");



var PilotsList = React.createClass({
    render: function() {
        var pilotsListNodes = this.props.pilots.map(function(pilot) {
            return (
                <li key={pilot.id}>id={pilot.id} distance={pilot.distance} lastSeen={pilot.lastSeen} age={pilot.age}</li>
            );
        });

        return (
            <ul>
                {pilotsListNodes}
            </ul>
        );
    }
});

var InFlight = React.createClass({
    getInitialState: function() {
        return {
            searching: true,
            activePilots: []
        };
    },

    render: function() {
        var latitude = parseFloat(this.props.params.latitude);
        var longitude = parseFloat(this.props.params.longitude);
        var flightId = this.props.params.flightId;

        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>{this.state.searching ? 'SEARCHING' : 'IN FLIGHT'}</h1>
                    </div>
                </div>
                <GMap latitude={latitude} longitude={longitude} address={this.props.params.address} showAddress={true}
                      width={500} height={500} zoom={15} />
                <div className="row">
                    <div className="col-xs-12">
                        <p>Pick up time is approximately X min.</p>
                        {!this.state.searching && <button type="button" className="btn btn-success" onClick={this.onCall}>Call Pilot</button>}
                        <button type="button" className="btn btn-danger" onClick={this.onCancel}>Cancel</button>
                        <hr />
                        <p>Flight ID: {flightId}</p>
                        <p>Nr Pilots: {_.size(this.state.activePilots)}</p>
                        <PilotsList pilots={this.state.activePilots} />
                    </div>
                </div>
            </div>
        );
    },

    onPilotsUpdate: function(pilots) {
        console.log("UPDATE", pilots);
        var clientPos = {latitude: parseFloat(this.props.params.latitude),
                         longitude: parseFloat(this.props.params.longitude)};
        var now = Date.now();

        var activePilots = _.chain(pilots)
                       .mapValues(function(val, key) {
                            val.id = key;
                            val.distance = geolib.getDistance(clientPos, val);
                            val.age = now - val.lastSeen;
                            return val;
                        })
                       .filter(function(pilot) {
                           return pilot.online && now - pilot.lastSeen < 600000;
                       })
                       .sortBy('distance')
                       .value();

        this.setState({activePilots: activePilots});
    },

    componentDidMount: function() {
        this.props.client.listenPilots(this.onPilotsUpdate);
    },

    componentWillUnmount: function() {
        this.props.client.unlistenPilots();
    },

    onCall: function() {
        console.log("calling");
    },

    onCancel: function() {
        Router.transitionTo('client');
    },
});

module.exports = InFlight;
