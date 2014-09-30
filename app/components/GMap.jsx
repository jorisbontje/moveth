/**
 * @jsx React.DOM
 */

var React = require('react');

/* global google */
var GMap = React.createClass({

    // initialize local variables
    getInitialState: function() {
        return {
            geocoder: null,
            map: null,
            marker: null,
            watch: null
        };
    },

    // set some default values
    getDefaultProps: function() {
        return {
            latitude: 0,
            longitude: 0,
            address: '',
            zoom: 15,
            width: 340,
            height: 340,
            gmaps_api_key: '',
            showAddress: false,
            watch: false
        };
    },

    updateCenter: function(latitude, longitude) {
        var map = this.state.map;
        if (map === null) return false;

        var marker = this.state.marker;

        var latlng = new google.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);
        marker.setPosition(latlng);

        if (this.props.onAddressChange && (this.props.latitude != latitude || this.props.longitude != longitude)) {
            var geocoder = this.state.geocoder;
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var address = results[0].formatted_address;
                        console.log("ADDRESS", address);
                        this.props.onAddressChange(address);
                    } else {
                        console.log('GEOCODER: No results found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            }.bind(this));
        }
    },

    render: function() {

        var style = {
            height: this.props.height
        };

        return (
                <div>
                    {this.props.showAddress &&
                        <div className="row">
                            <div className="col-xs-12">
                                <p><i className="fa fa-location-arrow"></i>
                                {' '}
                                Pickup location: <strong>{this.props.address}</strong></p>
                            </div>
                        </div>}
                    <div className="row">
                        <div className="col-xs-12" ref="map" style={style}></div>
                    </div>
                </div>
               );
    },

    componentDidMount: function() {

        window.mapLoaded = (function() {
            var center = new google.maps.LatLng(this.props.latitude, this.props.longitude);

            var mapOptions = {
                zoom: this.props.zoom,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(this.refs.map.getDOMNode(), mapOptions);
            var marker = new google.maps.Marker({
                position: center,
                map: map,
                title: "YOU"
            });

            var geocoder = new google.maps.Geocoder();

            this.setState({map: map, marker: marker, geocoder: geocoder});

            google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoomLevel = map.getZoom();
                console.log("ZOOM", zoomLevel);
            });

        }).bind(this);

        if (typeof(window.google) === "undefined") {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.props.gmaps_api_key + '&callback=mapLoaded';
            document.head.appendChild(s);
        } else {
            window.mapLoaded();
        }

        if (this.props.onLocationChange) {
            var geoOptions = {enableHighAccuracy: true, maximumAge: 60000, timeout: 15000};
            if (this.props.watch) {
                var watch = navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, geoOptions);
                this.setState({watch: watch});
            } else {
                navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, geoOptions);
            }
        }
    },

    componentWillUnmount: function() {
        if (this.state.watch) {
            navigator.geolocation.clearWatch(this.state.watch);
        }
    },

    // update markers if needed
    componentWillReceiveProps: function(props) {
        if(props.latitude || props.longitude) this.updateCenter(props.latitude, props.longitude);
    },

    geoSuccess: function(position) {
        console.log("POSITION", position);
        if (this.isMounted()) {
            this.props.onLocationChange(position.coords.latitude, position.coords.longitude);
        }
    },

    geoError: function(error) {
        console.log("ERROR", error);
    },

});

module.exports = GMap;

