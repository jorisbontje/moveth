/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var geolib = require("geolib");
var moment = require("moment");

var constants = require("../constants");
var FlightInfoMixin = require("./FlightInfoMixin");

var BASE_FARE = 2.50;
var MINUTE_FARE = 0.20;
var KM_FARE = 1.10;


var ReceiptDetails = React.createClass({

    render: function() {
        var duration = moment(this.props.flight.dropoff.timestamp).diff(this.props.flight.pickup.timestamp, 'minutes');
        var distance = geolib.getDistance(this.props.flight.pickup, this.props.flight.dropoff) / 1000;
        var price = BASE_FARE + duration *  MINUTE_FARE + distance * KM_FARE;

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        {constants.CURRENCY} {price.toFixed(2)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Flight Summary</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-4">
                        <i className="fa fa-user fa-4x"></i>
                        <p>Bob</p>
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-clock-o fa-4x"></i>
                        <p>{duration} min</p>
                    </div>
                    <div className="col-xs-4">
                        <i className="fa fa-globe fa-4x"></i>
                        <p>{distance.toFixed(1)} km</p>
                    </div>
                </div>
            </div>
        );
    }
});

var Receipt = React.createClass({
    mixins: [FlightInfoMixin],

    contextTypes: {
        client: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            flightId: null
        };
    },

    isPilot: function() {
        return this.props.params.role === 'pilot';
    },

    render: function() {
        if (!this.state.flight) {
            return null;
        }
        var isPilot = this.isPilot();
        var showRating = !this.state.flight.rating || (isPilot && !this.state.flight.rating.pilot) || (!isPilot && !this.state.flight.rating.client);

        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-9">
                        <h1>movETH</h1>
                        {' '}
                        <h2>{isPilot ? 'You Received' : 'Receipt'}</h2>
                    </div>
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-default" onClick={this.onToMain}>To {isPilot ? 'Pilot' : 'Client'}</button>
                    </div>
                </div>

                <ReceiptDetails flight={this.state.flight} />

                {showRating &&
                    <div>
                        <div className="row">
                            <div className="col-xs-12">
                                <h2>Rate your flight</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-1">
                                <button type="button" className="btn btn-danger" onClick={this.onRateNegative}><i className="fa fa-thumbs-down"></i></button>
                            </div>
                            <div className="col-xs-11">
                                <button type="button" className="btn btn-success" onClick={this.onRatePositive}><i className="fa fa-thumbs-up"></i></button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    },

    componentDidMount: function() {
        this.setState({flightId: this.props.params.flightId});
    },

    onRatePositive: function() {
        this.context.client.rateFlight(this.state.flight, this.isPilot(), 1);
        this.onToMain();
    },

    onRateNegative: function() {
        this.context.client.rateFlight(this.state.flight, this.isPilot(), -1);
        this.onToMain();
    },

    onToMain: function() {
        if (this.isPilot()) {
            Router.transitionTo('pilot');
        } else {
            Router.transitionTo('client');
        }
    }
});

module.exports = Receipt;
