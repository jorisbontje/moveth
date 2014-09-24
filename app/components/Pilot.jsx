/** @jsx React.DOM */

var React = require("react");

var GMap = require("./GMap");

var Pilot = React.createClass({
    getInitialState: function() {
        return {
            latitude: parseFloat(localStorage["moveth:lat"]) || 51.521048,
            longitude: parseFloat(localStorage["moveth:long"] ) || 0.051374,
            online: false
        };
    },

    render: function() {
        return (
            <div className="client">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>movETH - Pilot
                        {' '}
                        {this.state.online ?
                            <span className="label label-success">Online</span>
                        :
                            <span className="label label-danger">Offline</span>
                        }
                        </h1>
                    </div>
                </div>
                <GMap latitude={this.state.latitude} longitude={this.state.longitude} watch={true}
                      width={500} height={500} zoom={15} onLocationChange={this.onLocationChange} />
                <div className="row">
                    <div className="col-xs-12">
                        {this.state.online ?
                            <button type="button" className="btn btn-info" onClick={this.onGoOffline}>Go Offline</button>
                        :
                            <button type="button" className="btn btn-info" onClick={this.onGoOnline}>Go Online</button>
                        }
                        <hr />
                        <p>UID: {this.props.uid}</p>
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                    </div>
                </div>
            </div>
        );
    },

    onLocationChange: function(latitude, longitude) {
        console.log("location changed", latitude, longitude);
        localStorage["moveth:lat"] = latitude;
        localStorage["moveth:long"] = longitude;
        this.setState({latitude: latitude, longitude: longitude});
        // if online, update location
    },

    onGoOnline: function() {
        console.log("go online");
        this.setState({online: true});
        // register account / name
    },

    onGoOffline: function() {
        console.log("go offline");
        this.setState({online: false});
    }
});

module.exports = Pilot;
