/** @jsx React.DOM */

var React = require("react");
var GMap = require("./GMap");
var _ = require("lodash");

var LocationSearch = React.createClass({
    render: function() {
        return (
            <form className="form-inline" role="form">
                <div className="form-group">
                    <label className="sr-only" forHtml="pickupLocation">Pickup location</label>
                    <input type="text" className="form-control" id="pickupLocation" placeholder="Pickup location" />
                </div>
                <button type="submit" className="btn btn-default">Search</button>
            </form>
        );
    }
});

var Client = React.createClass({
    render: function() {
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>movETH</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <LocationSearch />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <GMap latitude={60.170833} longitude={24.9375} zoom={5} width={250} height={250}
                              points={[{latitude:60.1876172,longitude:24.815366,title:"HIIT Open Innovation House"},{latitude:60.185478,longitude:24.812257,title:"HIIT Otaniemi"}, {latitude:60.2049747,longitude:24.9634712,title:"HIIT Kumpula"}]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <p>We have X pilots in your area.</p>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Client;
