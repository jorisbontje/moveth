var secureRandom = require('secure-random');

var utils = {
  randomId: function() {
      return secureRandom.randomBuffer(32).toString('hex');
  }
};

module.exports = utils;
