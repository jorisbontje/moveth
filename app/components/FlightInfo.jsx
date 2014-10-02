/** @jsx React.DOM */

var React = require("react");

var geolib = require("geolib");
var moment = require("moment");

var BASE_FARE = 2.50;
var MINUTE_FARE = 0.20;
var KM_FARE = 1.10;

var FlightInfo = React.createClass({

    render: function() {
        if (!this.props.flight) {
            return null;
        }

        var duration = null;
        var distance = null;
        var price = null;

        if (this.props.flight.dropoff) {
            duration = moment(this.props.flight.dropoff.timestamp).diff(this.props.flight.pickup.timestamp, 'minutes');
            distance = geolib.getDistance(this.props.flight.pickup, this.props.flight.dropoff) / 1000;
            price = BASE_FARE + duration *  MINUTE_FARE + distance * KM_FARE;
        }

        return (
            <div>
                <h2>Flight Info</h2>
                <ul>
                    <li>id={this.props.flight.id}</li>
                    <li>Pickup: latitude={this.props.flight.pickup.latitude} longitude={this.props.flight.pickup.longitude}</li>
                    {this.props.flight.dropoff &&
                        <li>Dropoff: latitude={this.props.flight.dropoff.latitude} longitude={this.props.flight.dropoff.longitude}</li>}
                    <li>Duration={duration} min</li>
                    <li>Distance={distance.toFixed(1)} km</li>
                    {price &&
                        <li>Price={price.toFixed(2)}</li>}
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
