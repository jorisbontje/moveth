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
            markers: []
        };
    },

    // set some default values
    getDefaultProps: function() {
        return {
            latitude: 0,
            longitude: 0,
            locationText: '',
            zoom: 4,
            width: 500,
            height: 500,
            points: [],
            gmaps_api_key: ''
        };
    },

    // update geo-encoded markers
    updateMarkers: function(points) {

        var markers = this.state.markers;
        var map = this.state.map;

        // map may not be loaded when parent component re-renders;
        if (map === null) return false;

        // remove everything
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        this.state.markers = [];

        // add new markers
        points.forEach((function(point) {

            var location = new google.maps.LatLng(point.latitude , point.longitude);

            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: point.label
            });

            markers.push( marker );
        }));

        this.setState({markers: markers});
    },

    updateCenter: function(latitude, longitude) {
        var map = this.state.map;
        if (map === null) return false;

        var latlng = new google.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);

        var geocoder = this.state.geocoder;
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("GEOCODER", results);
                if (results[0]) {
                    this.setState({locationText: results[0].formatted_address});
                } else {
                    console.log('GEOCODER: No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        }.bind(this));
    },

    render: function() {

        var style = {
            width: this.props.width,
            height: this.props.height
        };

        return (
                <div style={style}></div>
               );
    },

    componentDidMount: function() {

        window.mapLoaded = (function() {

            var mapOptions = {
                zoom: this.props.zoom,
                center: new google.maps.LatLng(this.props.latitude, this.props.longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(this.getDOMNode(), mapOptions);
            var geocoder = new google.maps.Geocoder();

            this.setState({ map: map, geocoder: geocoder});
            this.updateMarkers(this.props.points);

            google.maps.event.addListener(map, 'zoom_changed', function() {
                var zoomLevel = map.getZoom();
                console.log("ZOOM", zoomLevel);
            });

        }).bind(this);

        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.props.gmaps_api_key + '&callback=mapLoaded';
        document.head.appendChild(s);

    },

    // update markers if needed
    componentWillReceiveProps : function(props) {
        console.log(props);
        if(props.latitude || props.longitude) this.updateCenter(props.latitude, props.longitude);
        if(props.points) this.updateMarkers(props.points);
    }

});

module.exports = GMap;

