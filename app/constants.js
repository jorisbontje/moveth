var keyMirror = require('react/lib/keyMirror');

module.exports = {
    CHANGE_EVENT: "change",
    CURRENCY: "USD",
    RADAR_MAX_LAST_SEEN: 600000,
    VALID_USERNAME_PATTERN: "[a-z0-9_.+@-]{1,32}",
    radar: keyMirror({
        REGISTER_RADAR: null,
        UPDATE_POSITION: null,
        UPDATE_PILOTS: null
    }),
    user: keyMirror({
        LOAD_CURRENT_USER: null,
        LOAD_USER: null,
        LOAD_USER_SUCCESS: null,
        UNLOAD_USER: null
    })
};
