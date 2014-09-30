/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var FlightInfo = require("./FlightInfo");
var FlightInfoMixin = require("./FlightInfoMixin");
var GMap = require("./GMap");
var PilotFinder = require("./PilotFinder");

var InFlight = React.createClass({
    mixins: [FlightInfoMixin],

    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            flightId: null
        };
    },

    render: function() {
        var latitude = parseFloat(this.props.params.latitude);
        var longitude = parseFloat(this.props.params.longitude);
        var searching = this.state.flight && !this.state.flight.pilotId;

        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>{searching ? 'SEARCHING' : 'IN FLIGHT'}</h1>
                    </div>
                </div>
                <GMap latitude={latitude} longitude={longitude} address={this.props.params.address} showAddress={true} />
                <div className="row">
                    <div className="col-xs-12">
                        <p>Pick up time is approximately X min.</p>
                        {!searching &&
                            <button type="button" className="btn btn-success" onClick={this.onCall}>Call Pilot</button>
                        }
                        <button type="button" className="btn btn-danger" onClick={this.onCancel}>Cancel</button>
                        <hr />
                        <FlightInfo flight={this.state.flight} />
                        {searching &&
                            <PilotFinder latitude={latitude} longitude={longitude} flightId={this.state.flightId} />
                        }
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this.setState({flightId: this.props.params.flightId});
    },

    onCall: function() {
        console.log("calling");
    },

    onCancel: function() {
        Router.transitionTo('client');
    },

    onComplete: function() {
        Router.transitionTo('receipt', {flightId: this.state.flightId, role: 'client'});
    }
});

module.exports = InFlight;
