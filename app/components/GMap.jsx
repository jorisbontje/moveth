/**
 * @jsx React.DOM
 */

var React = require('react');

// http://snazzymaps.com/style/18/retro
var GMAP_STYLE = [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}];

/* global google */
var GMap = React.createClass({

    // initialize local variables
    getInitialState: function() {
        return {
            geocoder: null,
            map: null,
            center: null,
            markers: [],
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
            height: "40vw",
            points: [],
            gmaps_api_key: '',
            showAddress: false,
            markerOnline: true,
            watch: false
        };
    },

    updateCenter: function(latitude, longitude, markerOnline) {
        var map = this.state.map;
        if (map === null) return false;

        var center = this.state.center;

        var latlng = new google.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);
        center.setPosition(latlng);

        if (markerOnline) {
            center.setIcon("https://maps.google.com/mapfiles/ms/icons/green-dot.png");
        } else {
            center.setIcon("https://maps.google.com/mapfiles/ms/icons/red-dot.png");
        }

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

    updateMarkers: function(points) {
        var markers = this.state.markers;
        var map = this.state.map;

        // remove everything
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        this.state.markers = [];

        // add new markers
        points.forEach((function(point) {
            var latLng = new google.maps.LatLng(point.latitude, point.longitude);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: point.name,
                icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scale: 20,
                zIndex: 0
            });

            markers.push(marker);

        }));

        this.setState({markers: markers});
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
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: GMAP_STYLE
            };

            var map = new google.maps.Map(this.refs.map.getDOMNode(), mapOptions);

            var marker = new google.maps.Marker({
                position: center,
                map: map,
                title: "YOU",
                icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            });

            var geocoder = new google.maps.Geocoder();

            this.setState({map: map, center: marker, geocoder: geocoder});
            this.updateMarkers(this.props.points);

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
        if(props.latitude || props.longitude) this.updateCenter(props.latitude, props.longitude, props.markerOnline);
        if(props.points) this.updateMarkers(props.points);
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

