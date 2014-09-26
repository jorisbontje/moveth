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
                        <p>UID: {this.props.client.UID()}</p>
                        <p>Lat: {this.state.latitude} Long: {this.state.longitude}</p>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        setInterval(this.track, this.props.trackInterval);
        this.props.client.registerPilotDisconnect();
    },

    onLocationChange: function(latitude, longitude) {
        console.log("location changed", latitude, longitude);
        localStorage["moveth:lat"] = latitude;
        localStorage["moveth:long"] = longitude;
        this.setState({latitude: latitude, longitude: longitude});
        this.track();
    },

    onGoOnline: function() {
        console.log("going online");
        this.setState({online: true});
        this.track(true);
    },

    onGoOffline: function() {
        console.log("going offline");
        this.setState({online: false});
        this.props.client.pilotOffline(Date.now());
    },

    track: function(force) {
        if (force || this.state.online) {
            console.log("updating tracking location");
            this.props.client.trackPilotLocation(this.state.latitude, this.state.longitude, Date.now());
        }
    }
});

module.exports = Pilot;
