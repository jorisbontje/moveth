/** @jsx React.DOM */

var React = require("react");
var GMap = require("./GMap");

var LocationSearch = React.createClass({
    getInitialState: function() {
        return {
            locationText: this.props.locationText
        };
    },

    render: function() {
        return (
            <form className="form-inline" role="form" onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label className="sr-only" forHtml="pickupLocation">Pickup location</label>
                    <input type="text" className="form-control" id="pickupLocation" placeholder="Pickup location" value={this.state.locationText} onChange={this.onLocationChange} />
                </div>
                <button type="submit" className="btn btn-default">Search</button>
            </form>
        );
    },

    onLocationChange: function(e) {
        this.setState({locationText: e.target.value});
    },

    onSubmit: function(e) {
        e.preventDefault();
        var locationText = this.state.locationText.trim();

        if (!locationText) {
            return false;
        }

        console.log("PICKUP", locationText);
        return false;
    }
});

var Client = React.createClass({
    getInitialState: function() {
        return {
            locationText: '',
            latitude: parseFloat(localStorage["moveth:lat"]) || 51.521048,
            longitude: parseFloat(localStorage["moveth:long"]) || 0.051374,
            zoom: 15
        };
    },

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
                        <LocationSearch locationText={this.state.locationText} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <GMap latitude={this.state.latitude} longitude={this.state.longitude} zoom={this.state.zoom}
                              width={500} height={500}
                              points={[{latitude:this.state.latitude, longitude:this.state.longitude, title:"YOU"}]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <p>We have X pilots in your area.</p>
                        <hr />
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                    </div>
                </div>
            </div>
        );
    },

    geoSuccess: function(position) {
        console.log("POSITION", position);
        this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
        localStorage["moveth:lat"] = position.coords.latitude;
        localStorage["moveth:long"] = position.coords.longitude;
    },

    geoError: function(error) {
        console.log("ERROR", error);
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    }
});

module.exports = Client;
