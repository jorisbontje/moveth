/** @jsx React.DOM */

var React = require("react");

var FlightInfo = React.createClass({
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            flight: {}
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
    },
});

module.exports = FlightInfo;
