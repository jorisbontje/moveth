/** @jsx React.DOM */

var React = require("react");

var Rating = require("./Rating");

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
                    <li>Pickup: latitude={this.props.flight.pickup.latitude} longitude={this.props.flight.pickup.longitude} timestamp={this.props.flight.pickup.timestamp}</li>
                    {this.props.flight.dropoff &&
                        <li>Dropoff: latitude={this.props.flight.dropoff.latitude} longitude={this.props.flight.dropoff.longitude} timestamp={this.props.flight.dropoff.timestamp}</li>}
                    <li>Client={this.props.flight.client.id} name={this.props.flight.client.name}
                    {' '}
                    <Rating rating={this.props.flight.client.rating} />
                    </li>
                    {this.props.flight.pilot &&
                        <li>Pilot={this.props.flight.pilot.id} name={this.props.flight.pilot.name}
                        {' '}
                        <Rating rating={this.props.flight.pilot.rating} /></li>
                    }
                </ul>
                {this.props.isPilot && !this.props.flight.pilot &&
                    <div className="btn-toolbar">
                        <button type="button" className="btn btn-success" onClick={this.props.onAccept}>Accept</button>
                        <button type="button" className="btn btn-danger" onClick={this.props.onReject}>Reject</button>
                    </div>
                }
                {this.props.isPilot && this.props.flight.pilot &&
                    <div>
                        <button type="button" className="btn btn-info" onClick={this.props.onComplete}>Complete</button>
                    </div>
                }
            </div>
        );
    }
});

module.exports = FlightInfo;
