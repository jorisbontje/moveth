/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var geolib = require("geolib");
var _ = require("lodash");

var FlightInfo = require("./FlightInfo");
var GMap = require("./GMap");
var PilotsList = require("./PilotsList");

var MAX_LAST_SEEN = 600000;

var InFlight = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

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
                        <FlightInfo flightId={flightId} />
                        <hr />
                        <p>Available Pilots: {_.size(this.state.activePilots)}</p>
                        <PilotsList pilots={this.state.activePilots} flightId={flightId} />
                    </div>
                </div>
            </div>
        );
    },

    onPilotsUpdate: function(pilots) {
        if (this.isMounted()) {
            var clientPos = {latitude: parseFloat(this.props.params.latitude),
                             longitude: parseFloat(this.props.params.longitude)};
            var now = Date.now();

            var activePilots = _.chain(pilots)
                           .mapValues(function(val, key) {
                                val.id = key;
                                val.age = now - val.lastSeen;
                                if (_.has(val, 'latitude') && _.has(val, 'longitude')) {
                                    val.distance = geolib.getDistance(clientPos, val);
                                }
                                return val;
                            })
                           .filter(function(pilot) {
                               return pilot.online && now - pilot.lastSeen < MAX_LAST_SEEN && _.has(pilot, 'distance');
                           })
                           .sortBy('distance')
                           .value();

            this.setState({activePilots: activePilots});
        }
    },

    componentDidMount: function() {
        this.context.client.listenPilots(this.onPilotsUpdate);
    },

    componentWillUnmount: function() {
        this.context.client.unlistenPilots();
    },

    onCall: function() {
        console.log("calling");
    },

    onCancel: function() {
        Router.transitionTo('client');
    },
});

module.exports = InFlight;
