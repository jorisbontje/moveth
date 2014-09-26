/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var GMap = require("./GMap");

var InFlight = React.createClass({
    getInitialState: function() {
        return {
            searching: true,
            pilots: []
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
                        <p>Nr Pilots: {this.state.pilots.length}</p>
                    </div>
                </div>
            </div>
        );
    },

    onPilotsUpdate: function(pilots) {
        this.setState({pilots: pilots});
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
