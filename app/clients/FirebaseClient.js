var Firebase = require("Firebase");

var utils = require("../utils");

var FirebaseClient = function(firebaseRef) {

    this.trackPilotLocation = function(latitude, longitude, lastSeen) {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).update({latitude: latitude, longitude: longitude, lastSeen: lastSeen, online: true});
    };

    this.pilotOffline = function(lastSeen) {
        var uid = this.UID();
        _firebaseRef.child('pilot').child(uid).update({lastSeen: lastSeen, online: false});
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
