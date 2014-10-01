/** @jsx React.DOM */

var React = require("react");

var geolib = require("geolib");
var _ = require("lodash");

var MAX_LAST_SEEN = 600000;

var PilotItem = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    render: function() {
        return (
            <li>
                id={this.props.pilot.id} distance={this.props.pilot.distance} lastSeen={this.props.pilot.lastSeen} age={this.props.pilot.age}
                <button type="button" className="btn btn-success" onClick={this.onPing}>Ping</button>
            </li>
        );
    },

    onPing: function() {
        console.log("ping", this.props.pilot.id);
        this.context.client.pingPilot(this.props.pilot.id, this.props.flightId);
    }
});

var PilotsList = React.createClass({
    render: function() {
        var pilotsListNodes = this.props.pilots.map(function(pilot) {
            return (
                <PilotItem key={pilot.id} pilot={pilot} flightId={this.props.flightId} />
            );
        }.bind(this));

        return (
            <ul>
                {pilotsListNodes}
            </ul>
        );
    }
});

var PilotFinder = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    propTypes: {
        flightId: React.PropTypes.string,
        latitude: React.PropTypes.number.isRequired,
        longitude: React.PropTypes.number.isRequired
    },

    getInitialState: function() {
        return {
            activePilots: []
        };
    },

    render: function() {
        return (
            <div>
                <p>We have {_.size(this.state.activePilots)} pilots in your area.</p>
                {!this.props.showSummary &&
                    <PilotsList pilots={this.state.activePilots} flightId={this.props.flightId} />
                }
            </div>
        );
    },

    onPilotsUpdate: function(pilots) {
        if (this.isMounted()) {
            var clientPos = {latitude: this.props.latitude,
                             longitude: this.props.longitude};
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
});

module.exports = PilotFinder;
