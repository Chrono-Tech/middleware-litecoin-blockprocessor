const BN = require('bn.js'),
  util = require('lcoin/lib/utils/util');

const testnetv4 = {};

testnetv4.type = 'testnet';

testnetv4.seeds = [
  'testnet-seed.litecointools.com',
  'seed-b.litecoin.loshan.co.uk',
  'dnsseed-testnet.thrasher.io',
  'testnet-seed.ltc.xurious.com'
];

testnetv4.magic = 0xf1c8d2fd;

testnetv4.port = 19335;

testnetv4.checkpointMap = {
  2056: '8932a8789c96c516d8a1080a29c7e7e387d2397a83864f9adcaf97ba318a7417',
};

testnetv4.lastCheckpoint = 2056;

testnetv4.halvingInterval = 840000;

testnetv4.genesis = {
  version: 1,
  hash: 'a0293e4eeb3da6e6f56f81ed595f57880d1a21569e13eefdd951284b5a626649',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: 'd9ced4ed1130f7b7faad9be25323ffafa33232a17c3edf6cfd97bee6bafbdd97',
  ts: 1486949366,
  bits: 504365040,
  nonce: 293345,
  height: 0
};

testnetv4.genesisBlock =
  '010000000000000000000000000000000000000000000000000000000000000000000'
  + '000d9ced4ed1130f7b7faad9be25323ffafa33232a17c3edf6cfd97bee6bafbdd97f6'
  + '0ba158f0ff0f1ee179040001010000000100000000000000000000000000000000000'
  + '00000000000000000000000000000ffffffff4804ffff001d0104404e592054696d65'
  + '732030352f4f63742f32303131205374657665204a6f62732c204170706c65e280997'
  + '320566973696f6e6172792c2044696573206174203536ffffffff0100f2052a010000'
  + '004341040184710fa689ad5023690c80f3a49c8f13f8d45b8c857fbcbc8bc4a8e4d3e'
  + 'b4b10f4d4604fa08dce601aaf0f470216fe1b51850b4acf21b179c45070ac7b03a9ac'
  + '00000000';

testnetv4.pow = {
  limit: new BN(
    '00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 504365055,
  chainwork: new BN(
    '00000000000000000000000000000000000000000000000000000000872d04d7',
    'hex'
  ),
  targetTimespan: 3.5 * 24 * 60 * 60,
  targetSpacing: 2.5 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

testnetv4.block = {
  bip34height: 0xffffffff,
  bip34hash: null,
  bip65height: 76,
  bip65hash: '73058ccc33da8b5479e3548c3cce4fb32a705fa9803994fd5f498bed71c77580',
  bip66height: 76,
  bip66hash: '73058ccc33da8b5479e3548c3cce4fb32a705fa9803994fd5f498bed71c77580',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 24 * 60 * 60,
  slowHeight: 950000
};

testnetv4.bip30 = {};

testnetv4.activationThreshold = 1512; // 75% for testchains

testnetv4.minerWindow = 2016; // nPowTargetTimespan / nPowTargetSpacing

testnetv4.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 1483228800, // January 1, 2017
    timeout: 1517356801, // January 31st, 2018
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 1483228800, // January 1, 2017
    timeout: 1517356801, // January 31st, 2018
    force: false
  }
};

testnetv4.deploys = [
  testnetv4.deployments.csv,
  testnetv4.deployments.segwit,
  testnetv4.deployments.testdummy
];

testnetv4.keyPrefix = {
  privkey: 0xef,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394,
  xpubkey58: 'tpub',
  xprivkey58: 'tprv',
  coinType: 1
};

testnetv4.addressPrefix = {
  pubkeyhash: 0x6f,
  scripthash: 0xc4,
  witnesspubkeyhash: 0x03,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

testnetv4.requireStandard = false;

testnetv4.rpcPort = 19336;

testnetv4.minRelay = 1000;

testnetv4.feeRate = 20000;

testnetv4.maxFeeRate = 60000;

testnetv4.selfConnect = false;

testnetv4.requestMempool = false;

module.exports = testnetv4;
