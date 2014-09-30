/** @jsx React.DOM */

var React = require("react");

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

module.exports = PilotsList;
