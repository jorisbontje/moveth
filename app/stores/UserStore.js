var Fluxxor = require("fluxxor");

var constants = require("../constants");

var UserStore = Fluxxor.createStore({

    initialize: function(options) {
        this.currentUserId = null;
        this.users = options.users || {};
        this.loading = false;
        this.error = null;

        this.bindActions(
            constants.user.LOAD_CURRENT_USER, this.onLoadCurrentUser,
            constants.user.LOAD_USER, this.onLoadUser,
            constants.user.LOAD_USER_SUCCESS, this.onLoadUserSuccess,
            constants.user.UNLOAD_USER, this.onUnLoadUser
        );

        this.setMaxListeners(1024); // prevent "possible EventEmitter memory leak detected"
    },

    onLoadCurrentUser: function(payload) {
        this.currentUserId = payload.uid;
        this.users[payload.uid] = {loading: true};
        this.loading = true;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadUser: function(payload) {
        console.log("onLoadUser", payload);
        this.users[payload.uid] = {loading: true};
        this.loading = true;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadUserSuccess: function(payload) {
        this.users[payload.user.id] = payload.user;
        this.loading = false;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onUnLoadUser: function(payload) {
        if (payload.uid == this.currentUserId) {
            this.currentUserId = null;
        }
        delete this.users[payload.uid];
        this.loading = false;
        this.error = payload.error;
        this.emit(constants.CHANGE_EVENT);
    },

    getState: function() {
        return {
            currentUser: this.users[this.currentUserId],
            currentUserId: this.currentUserId,
            users: this.users,
            loading: this.loading,
            error: this.error
        };
    }
});

module.exports = UserStore;
