var Firebase = require("Firebase");

var utils = require("../utils");

var FirebaseClient = function(firebaseRef) {

    this.trackPilotLocation = function(user, latitude, longitude, lastSeen) {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).update({name: user.name, rating: user.rating || {}, latitude: latitude, longitude: longitude, lastSeen: lastSeen, online: true});
        _firebaseRef.child('pilot').child(uid).setPriority(lastSeen);
    };

    this.pilotOffline = function(lastSeen) {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).update({lastSeen: lastSeen, online: false});
        _firebaseRef.child('pilot').child(uid).setPriority(lastSeen);
    };

    this.registerPilotDisconnect = function() {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).onDisconnect().update({online: false});
    };

    /**
     * Removes 2-day old pilots based on the set priority
     */
    this.removeOldPilots = function() {
        var timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - 2);
        _firebaseRef.child('pilot').endAt(timestamp.getTime()).on("child_added", function(snap) {
            snap.ref().remove();
        });
    };

    this.listenPilots = function(callback) {
        _firebaseRef.child('pilot').on('value', function(data) {
            var pilots = data.val();
            callback(pilots);
        });
    };

    this.unlistenPilots = function() {
        _firebaseRef.child('pilot').off('value');
    };

    this.registerFlight = function(flightId, latitude, longitude, user) {
        var uid = this.UID();
        var now = Date.now();
        var pickup = {latitude: latitude, longitude: longitude, timestamp: now};
        _firebaseRef.child('flight').child(flightId).setWithPriority({flightId: flightId, pickup: pickup, client: {id: uid, name: user.name, rating: user.rating || {}}}, now);
    };

    /**
     * Removes 2-day old flights based on the set priority
     */
    this.removeOldFlights = function() {
        var timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - 2);
        _firebaseRef.child('flight').endAt(timestamp.getTime()).on("child_added", function(snap) {
            snap.ref().remove();
        });
    };

    this.acceptFlight = function(flightId) {
        var uid = this.UID();
        _firebaseRef.child('flight').child(flightId).update({pilotId: uid});
    };

    this.rejectFlight = function(flightId) {
        var uid = this.UID();
        _firebaseRef.child('flight').child(flightId).child('rejects').push({pilotId: uid});
    };

    this.completeFlight = function(flightId, latitude, longitude) {
        var now = Date.now();
        var dropoff = {latitude: latitude, longitude: longitude, timestamp: now};
        _firebaseRef.child('flight').child(flightId).update({completed: true, dropoff: dropoff});
    };

    this.rateFlight = function(flight, isPilot, rating) {
        var flightRef = _firebaseRef.child('flight').child(flight.id).child('rating');
        var userRef = null;

        if (isPilot) {
            flightRef.update({pilot: rating});
            userRef = _firebaseRef.child('user').child(flight.clientId);
        } else {
            flightRef.update({client: rating});
            userRef = _firebaseRef.child('user').child(flight.pilotId);
        }

        userRef.child('rating/' + (rating > 0 ? 'pos' : 'neg')).transaction(function(currentRating) {
            return currentRating+1;
        });
    };

    this.pingPilot = function(pilotId, flightId) {
        _firebaseRef.child('pilot').child(pilotId).child('requests').push({flightId: flightId});
    };

    this.listenFlightRequests = function(callback) {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).child('requests').on('child_added', function(data) {
            var request = data.val();
            callback(request.flightId);
            data.ref().remove();
        });
    };

    this.unlistenFlightRequests = function() {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).child('requests').off('child_added');
    };

    this.listenFlightInfo = function(flightId, callback) {
        if (!flightId) {
            return;
        }
        _firebaseRef.child('flight').child(flightId).on('value', function(data) {
            var flight = data.val();
            flight.id = flightId;
            callback(flight);
        });
    };

    this.unlistenFlightInfo = function(flightId) {
        if (!flightId) {
            return;
        }
        _firebaseRef.child('flight').child(flightId).off('value');
    };

    this.listenUserProfile = function(uid, callback) {
        _firebaseRef.child('user').child(uid).on('value', function(data) {
            var user = data.val() || {};
            user.id = uid;
            callback(user);
        });
    };

    this.unlistenUserProfile = function(uid) {
        _firebaseRef.child('user').child(uid).off('value');
    };

    this.setUserName = function(name) {
        var uid = this.UID();
        _firebaseRef.child('user').child(uid).update({name: name});
    };

    this.UID = function() {
        /* global localStorage */
        var uidKey = 'moveth:uid';
        var uid = localStorage.getItem(uidKey);
        if (!uid) {
            uid = utils.randomId();
            localStorage.setItem(uidKey, uid);
        }
        return(uid);
    };

    this.ref = function() {
        return _firebaseRef;
    };

    this._onComplete = function(item, success, failure) {
        return function(error) {
            if (error) {
                failure(error);
            } else {
                success(item);
            }
        };
    };

    if (firebaseRef instanceof Firebase === false) {
        throw new Error("firebaseRef must be an instance of Firebase");
    }

    var _firebaseRef = firebaseRef;
};

module.exports = FirebaseClient;
