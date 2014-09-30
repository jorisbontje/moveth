var React = require("react");

var FlightInfoMixin = {
    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            flight: null,
        };
    },

    setFlightId: function(flightId) {
        this.setState({flightId: flightId});
    },

    componentDidMount: function() {
        this.context.client.listenFlightInfo(this.state.flightId, this.onFlightInfo);
    },

    componentWillUnmount: function() {
        this.context.client.unlistenFlightInfo(this.state.flightId);
    },

    componentWillUpdate: function(props, state) {
        if (this.state.flightId !== state.flightId) {
            this.context.client.unlistenFlightInfo(this.state.flightId);
            this.context.client.listenFlightInfo(state.flightId, this.onFlightInfo);
        }
    },

    onFlightInfo: function(flight) {
        this.setState({flight: flight});

        // TODO for both client and pilot
        if (flight.completed) {
            this.onComplete();
        }
    }
};

module.exports = FlightInfoMixin;
