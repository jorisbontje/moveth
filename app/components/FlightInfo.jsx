/** @jsx React.DOM */

var React = require("react");

var FlightInfo = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            flight: {},
        };
    },

    render: function() {
        if (!this.props.flightId) {
            return null;
        }

        return (
            <div>
                <h2>Flight Info</h2>
                id={this.props.flightId}
                {' '}
                Pickup latitude={this.state.flight.latitude} longitude={this.state.flight.longitude}
                {' '}
                Pilot={this.state.flight.pilotId}
                {this.props.isPilot && !this.state.flight.pilotId &&
                    <div>
                        <button type="button" className="btn btn-success" onClick={this.props.onAccept}>Accept</button>
                        <button type="button" className="btn btn-danger" onClick={this.props.onReject}>Reject</button>
                    </div>
                }
            </div>
        );
    },

    componentDidMount: function() {
        this.context.client.listenFlightInfo(this.props.flightId, this.onFlightInfo);
    },

    componentWillUnmount: function() {
        this.context.client.unlistenFlightInfo(this.props.flightId);
    },

    componentWillReceiveProps: function(props) {
        this.context.client.unlistenFlightInfo(this.props.flightId);
        this.context.client.listenFlightInfo(props.flightId, this.onFlightInfo);
    },

    onFlightInfo: function(flight) {
        this.setState({flight: flight});
    }
});

module.exports = FlightInfo;
