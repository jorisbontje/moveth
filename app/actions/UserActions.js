var constants = require("../constants");

var UserActions = function(client) {

    this.loadCurrentUser = function(uid) {
        this.dispatch(constants.user.LOAD_CURRENT_USER, {uid: uid});

        _client.listenUserProfile(uid, function(user) {
            this.dispatch(constants.user.LOAD_USER_SUCCESS, {user: user});
        }.bind(this));
    };

    this.unloadCurrentUser = function() {
        var uid = this.flux.store("UserStore").currentUserId;
        this.dispatch(constants.user.UNLOAD_USER, {uid: uid});

        _client.unlistenUserProfile(uid);
    };

    this.loadUser = function(uid) {
        this.dispatch(constants.user.LOAD_USER, {uid: uid});

        _client.listenUserProfile(uid, function(user) {
            this.dispatch(constants.user.LOAD_USER_SUCCESS, {user: user});
        }.bind(this));
    };

    this.unloadUser = function(uid) {
        this.dispatch(constants.user.UNLOAD_USER, {uid: uid});

        _client.unlistenUserProfile(uid);
    };

    var _client = client;
};

module.exports = UserActions;
