var constants = require("../constants");

var RadarActions = function(client) {

    this.updatePosition = function(latitude, longitude) {
        this.dispatch(constants.radar.UPDATE_POSITION, {latitude: latitude, longitude: longitude});
    };

    this.registerRadar = function(latitude, longitude) {
        this.dispatch(constants.radar.REGISTER_RADAR, {latitude: latitude, longitude: longitude});

        _client.listenPilots(function(pilots) {
            this.dispatch(constants.radar.UPDATE_PILOTS, {pilots: pilots});
        }.bind(this));
    };

    this.unRegisterRadar = function() {
        this.dispatch(constants.radar.UNREGISTER_RADAR);

        _client.unlistenPilots();
    };

    var _client = client;
};

module.exports = RadarActions;
