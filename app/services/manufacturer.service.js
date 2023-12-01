const logger = require('../common/logger')('manufacturer.service');
const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('./common.service');

const manufacturers = db.collection(DB_NAME.MANUFACTURERS);

const manufacturerService = {
  list: () => {
    logger.verbose('list');
    return manufacturers
      .aggregate([{ $match: { status: 1 } }, { $project: { name: 1 } }, { $sort: { name: 1 } }])
      .toArray();
  },
  save: (payload) => {
    logger.verbose('save', payload);
    return manufacturers.insertOne({ ...payload, ...commonService.insertTimestamp() });
  }
};

module.exports = manufacturerService;
