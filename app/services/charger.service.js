const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('./common.service');

const chargers = db.collection(DB_NAME.CHARGERS);

const chargerService = {
  list: async () => {
    const payload = await chargers.find().toArray();
    const counts = await chargers.countDocuments();
    return { payload, counts };
  },
  save: (payload) => chargers.insertOne({ ...payload, ...commonService.insertTimestamp() })
};

module.exports = chargerService;
