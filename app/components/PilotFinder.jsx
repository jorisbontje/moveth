/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Rating = require("./Rating");

var PilotItem = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    render: function() {
        return (
            <li>
                id={this.props.pilot.id} distance={this.props.pilot.distance} lastSeen={this.props.pilot.lastSeen} age={this.props.pilot.age}
                {' '}
                <Rating rating={this.props.pilot.rating} />
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
    mixins: [FluxChildMixin, StoreWatchMixin("RadarStore")],

    propTypes: {
        flightId: React.PropTypes.string
    },

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return {
            radar: flux.store("RadarStore").getState()
        };
    },

    render: function() {
        var count = this.state.radar.activePilotsCount;
        return (
            <div>
                <p>We have {count} {count == 1 ? 'pilot' : 'pilots'} in your area.</p>
                {!this.props.showSummary &&
                    <PilotsList pilots={this.state.radar.activePilots} flightId={this.props.flightId} />
                }
            </div>
        );
    },

    componentWillReceiveProps: function(nextProps) {
        // TODO move to Map action
        if (this.props.latitude != nextProps.latitude || this.props.longitude != nextProps.longitude) {
            this.getFlux().actions.radar.updatePosition(nextProps.latitude, nextProps.longitude);
        }
    },

    componentDidMount: function() {
        this.getFlux().actions.radar.registerRadar(this.props.latitude, this.props.longitude);
        // TODO register start position?
    },

    componentWillUnmount: function() {
        this.getFlux().actions.radar.unRegisterRadar();
    },
});

module.exports = PilotFinder;
