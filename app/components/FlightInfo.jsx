/** @jsx React.DOM */

var React = require("react");

var FlightInfo = React.createClass({

    render: function() {
        if (!this.props.flight) {
            return null;
        }

        return (
            <div>
                <h2>Flight Info</h2>
                id={this.props.flight.id}
                {' '}
                Pickup latitude={this.props.flight.latitude} longitude={this.props.flight.longitude}
                {' '}
                Pilot={this.props.flight.pilotId}
                {this.props.isPilot && !this.props.flight.pilotId &&
                    <div>
                        <button type="button" className="btn btn-success" onClick={this.props.onAccept}>Accept</button>
                        <button type="button" className="btn btn-danger" onClick={this.props.onReject}>Reject</button>
                    </div>
                }
            </div>
        );
    }
});

module.exports = FlightInfo;
