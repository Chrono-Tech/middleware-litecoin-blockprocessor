const _ = require('lodash'),
  config = require('../config'),
  Promise = require('bluebird'),
  Network = require('lcoin/lib/protocol/network'),
  blockModel = require('../models/blockModel'),
  network = Network.get(config.node.network);

/**
 * @service
 * @description transform tx to full object
 * @param node - bcoin full node
 * @param txs - original block's array of tx objects
 * @returns {Promise.<*>}
 */

module.exports = async (node, txs) => {

  txs = txs.map(tx => tx.getJSON(network));

  let prevouts = _.chain(txs)
    .map(tx => tx.inputs)
    .flattenDeep()
    .map(input => _.get(input, 'prevout'))
    .compact()
    .uniq()
    .chunk(200)
    .value();


  let fetchedPrevOuts = await Promise.map(prevouts, async prevoutSet => {
    let hashes = prevoutSet.map(prev => prev.hash);
    return await blockModel.aggregate([
      {$match: {'txs.hash': {$in: hashes}}},
      {$unwind: '$txs'},
      {$match: {'txs.hash': {$in: hashes}}},
      {
        $project: {
          items: prevoutSet,
          outputs: {
            $map: {
              input: '$txs.outputs',
              as: 'output',
              in: {
                value: '$$output.value',
                address: '$$output.address',
                hash: '$txs.hash',
                index: {$indexOfArray: ['$txs.outputs', '$$output']}
              }
            }
          }
        }
      },
      {$unwind: '$items'},
      {
        $project: {
          outputs: {
            $filter: {
              input: '$outputs',
              as: 'output',
              cond: {
                $and: [
                  {$eq: ["$$output.hash", '$items.hash']},
                  {$eq: ["$$output.index", '$items.index']}
                ]
              }
            }
          }
        }
      },
      {$unwind: '$outputs'},
      {$group: {_id: 'a', outputs: {$addToSet: '$outputs'}}}
    ])
  }, {concurrency: 4});

  fetchedPrevOuts = _.chain(fetchedPrevOuts).map(prev=>_.get(prev, '0.outputs', [])).flattenDeep().value();

  const currentOuts = _.chain(txs)
    .map(tx =>
      tx.outputs.map((output, index) => ({
        hash: tx.hash,
        value: output.value,
        index: index
      }))
    )
    .flattenDeep()
    .value();

  fetchedPrevOuts = _.union(fetchedPrevOuts, currentOuts);

  return await Promise.map(txs, async tx => {

    let inputs = await Promise.mapSeries(tx.inputs, async input => {

      if (!_.has(input, 'prevout.hash') || !_.has(input, 'prevout.index') || !input.address)
        return {
          prevout: input.prevout,
          address: input.address,
          value: 0
        };

      const fetchedPrevOut = _.find(fetchedPrevOuts, {hash: input.prevout.hash, index: input.prevout.index});

      if (!fetchedPrevOut) {
        const tx = await node.rpc.getRawTransaction([input.prevout.hash, true]).catch(() => null);
        if (!tx)
          return null;

        const block = await node.rpc.getBlock([tx.blockhash]).catch(() => null);
        return {block: {number: block.height}};
      }

      return {
        prevout: input.prevout,
        address: input.address,
        value: _.get(fetchedPrevOut, 'value', 0) * Math.pow(10, 8)
      };
    });

    if (inputs.includes(null) || _.find(inputs, input => _.has(input, 'block.number')))
      return Promise.reject({code: 1});

    inputs = _.chain(tx.inputs)
      .map(txInput =>
        _.find(inputs, input => _.isEqual(input.prevout, txInput.prevout))
      )
      .value();

    return {
      value: tx.value,
      hash: tx.hash,
      fee: tx.fee,
      minFee: tx.minFee,
      inputs: _.compact(inputs),
      outputs: tx.outputs.map(output => ({
        address: output.address,
        value: output.value * Math.pow(10, 8)
      }))
    };

  })

};
