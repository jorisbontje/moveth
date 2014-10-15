var keyMirror = require('react/lib/keyMirror');

module.exports = {
    CHANGE_EVENT: "change",
    CURRENCY: "USD",
    VALID_USERNAME_PATTERN: "[a-z0-9_.+@-]{1,32}",
    user: keyMirror({
        LOAD_CURRENT_USER: null,
        LOAD_USER: null,
        LOAD_USER_SUCCESS: null,
        UNLOAD_USER: null
    })
};
