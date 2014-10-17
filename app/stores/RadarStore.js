var Fluxxor = require("fluxxor");

var geolib = require("geolib");
var _ = require("lodash");

var constants = require("../constants");

var RadarStore = Fluxxor.createStore({

    initialize: function(options) {
        this.position = options.position || null;
        this.pilots = options.pilots || [];
        this.activePilots = [];
        this.activePilotsCount = 0;

        this.bindActions(
            constants.radar.REGISTER_RADAR, this.onRegisterRadar,
            constants.radar.UPDATE_POSITION, this.onUpdatePosition,
            constants.radar.UPDATE_PILOTS, this.onUpdatePilots
        );

        this.setMaxListeners(1024); // prevent "possible EventEmitter memory leak detected"
    },

    // TODO remove duplicate of onUpdatePosition?
    onRegisterRadar: function(payload) {
        this.position = payload;
        this.emit(constants.CHANGE_EVENT);
    },

    onUpdatePosition: function(payload) {
        this.position = payload;
        this.updateActivePilots();
        this.emit(constants.CHANGE_EVENT);
    },

    onUpdatePilots: function(payload) {
        this.pilots = payload.pilots;
        this.updateActivePilots();
        this.emit(constants.CHANGE_EVENT);
    },

    updateActivePilots: function() {
        var now = Date.now();

        var activePilots = _.chain(this.pilots)
                       .mapValues(function(val, key) {
                            val.id = key;
                            val.age = now - val.lastSeen;
                            if (_.has(val, 'latitude') && _.has(val, 'longitude')) {
                                val.distance = geolib.getDistance(this.position, val);
                            }
                            return val;
                        }, this)
                       .filter(function(pilot) {
                           return pilot.online && now - pilot.lastSeen < constants.RADAR_MAX_LAST_SEEN && _.has(pilot, 'distance');
                       })
                       .sortBy('distance')
                       .value();

        this.activePilots = activePilots;
        this.activePilotsCount = _.size(activePilots);
    },

    getState: function() {
        return {
            activePilots: this.activePilots,
            activePilotsCount: this.activePilotsCount
        };
    }
});

module.exports = RadarStore;
