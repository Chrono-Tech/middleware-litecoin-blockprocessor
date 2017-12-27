require('dotenv').config();

/**
 * @factory config
 * @description base app's configuration
 * @returns {{
 *  mongo: {
 *    uri: string,
 *    collectionPrefix: string
 *    },
 *  rabbit: {
 *    url: string,
 *    serviceName: string
 *    },
 *  node: {
 *    dbpath: string,
 *    network: string,
 *    dbDriver: string,
 *    ipcName: string,
 *    ipcPath: string
 *    }
 *  }}
 */

module.exports = {
  mongo: {
    accounts: {
      uri: process.env.MONGO_ACCOUNTS_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
      collectionPrefix: process.env.MONGO_ACCOUNTS_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX ||'litecoin'
    }
  },
  rabbit: {
    url: process.env.RABBIT_URI || 'amqp://localhost:5672',
    serviceName: process.env.RABBIT_SERVICE_NAME || 'app_litecoin'
  },
  node: {
    dbpath: process.env.DB_PATH || '',
    network: process.env.NETWORK || 'regtest',
    dbDriver: process.env.DB_DRIVER || 'memory',
    ipcName: process.env.IPC_NAME || 'litecoin',
    ipcPath: process.env.IPC_PATH || '/tmp/'
  }
};
