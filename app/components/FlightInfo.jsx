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
                <ul>
                    <li>id={this.props.flight.id}</li>
                    <li>Pickup: latitude={this.props.flight.latitude} longitude={this.props.flight.longitude}</li>
                    <li>Client={this.props.flight.clientId}</li>
                    <li>Pilot={this.props.flight.pilotId}</li>
                </ul>
                {this.props.isPilot && !this.props.flight.pilotId &&
                    <div>
                        <button type="button" className="btn btn-success" onClick={this.props.onAccept}>Accept</button>
                        <button type="button" className="btn btn-danger" onClick={this.props.onReject}>Reject</button>
                    </div>
                }
                {this.props.isPilot && this.props.flight.pilotId &&
                    <div>
                        <button type="button" className="btn btn-info" onClick={this.props.onComplete}>Complete</button>
                    </div>
                }
            </div>
        );
    }
});

module.exports = FlightInfo;
