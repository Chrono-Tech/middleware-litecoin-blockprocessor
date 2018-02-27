const requireAll = require('require-all'),
  _ = require('lodash'),
  lcoinNetworks = require('lcoin/lib/protocol/networks'),
  networks = requireAll({
    dirname: __dirname,
    filter: /(.+Network)\.js$/,
    recursive: true
  });

/**
 * @factory
 * @description modify bcoin networks, by adding bcc and test bcc networks definitions
 * specified routing key - i.e. event param
 * @param currentNetworkType - network name
 * @returns {Promise.<void>}
 */

module.exports = (currentNetworkType) => {

  let customNetwork = _.chain(networks)
    .values()
    .find({type: currentNetworkType})
    .value();

  if (!customNetwork)
    return;

  lcoinNetworks.types = _.union([currentNetworkType], lcoinNetworks.types);
  lcoinNetworks[currentNetworkType] = customNetwork;

};
