require('dotenv/config');

const config = require('../config'),
  Network = require('lcoin/lib/protocol/network'),
  lcoin = require('lcoin'),
  expect = require('chai').expect,
  accountModel = require('../models/accountModel'),
  ipcExec = require('./helpers/ipcExec'),
  _ = require('lodash'),
  ctx = {
    network: null,
    accounts: []
  },
  mongoose = require('mongoose');

mongoose.Promise = Promise;

describe('core/blockProcessor', function () {

  before(async () => {

    ctx.network = Network.get('regtest');

    let keyPair = lcoin.hd.generate(ctx.network);
    let keyPair2 = lcoin.hd.generate(ctx.network);
    let keyPair3 = lcoin.hd.generate(ctx.network);
    let keyPair4 = lcoin.hd.generate(ctx.network);

    ctx.accounts.push(keyPair, keyPair2, keyPair3, keyPair4);

    mongoose.connect(config.mongo.uri, {useMongoClient: true});
  });

  after(() => {
    return mongoose.disconnect();
  });

  it('validate balance', async () => {
    let keyring = new lcoin.keyring(ctx.accounts[0].privateKey, ctx.network);
    let coins = await ipcExec('getcoinsbyaddress', [keyring.getAddress().toString()]);

    ctx.summ = _.chain(coins)
      .map(c => c.value)
      .sum()
      .value();
  });

  it('generate blocks and initial coins', async () => {
    let keyring = new lcoin.keyring(ctx.accounts[0].privateKey, ctx.network);
    let response = await ipcExec('generatetoaddress', [10, keyring.getAddress().toString()]);
    expect(response).to.not.be.undefined;
  });

  it('validate balance again', async () => {
    let keyring = new lcoin.keyring(ctx.accounts[0].privateKey, ctx.network);
    let coins = await ipcExec('getcoinsbyaddress', [keyring.getAddress().toString()]);

    let newSumm = _.chain(coins)
      .map(c => c.value)
      .sum()
      .value();

    expect(newSumm).to.be.gt(ctx.summ);

  });

});
