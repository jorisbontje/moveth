/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var FlightInfo = require("./FlightInfo");
var FlightInfoMixin = require("./FlightInfoMixin");

var Receipt = React.createClass({
    mixins: [FlightInfoMixin],

    getInitialState: function() {
        return {
            flightId: null
        };
    },

    render: function() {
        var isPilot = this.props.params.role === 'pilot';
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-9">
                        <h1>movETH</h1>
                        {' '}
                        <h2>{isPilot ? 'You Received' : 'Receipt'}</h2>
                    </div>
                    <div className="col-xs-3">
                        {isPilot ?
                            <button type="button" className="btn btn-default" onClick={this.onToPilot}>To Pilot</button>
                        :
                            <button type="button" className="btn btn-default" onClick={this.onToClient}>To Client</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        USD 25
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <FlightInfo flight={this.state.flight} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Rate your flight</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-1">
                        <button type="button" className="btn btn-danger"><i className="fa fa-thumbs-down"></i></button>
                    </div>
                    <div className="col-xs-11">
                        <button type="button" className="btn btn-success"><i className="fa fa-thumbs-up"></i></button>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this.setState({flightId: this.props.params.flightId});
    },

    onToClient: function() {
        Router.transitionTo('client');
    },

    onToPilot: function() {
        Router.transitionTo('pilot');
    }
});

module.exports = Receipt;
