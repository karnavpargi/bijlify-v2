const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('./common.service');

const company = db.collection(DB_NAME.COMPANIES);

const chargerService = {
  list: async () => {
    const payload = await company.find().toArray();
    const counts = await company.countDocuments();
    return { payload, counts };
  },
  save: (payload) => company.insertOne({ ...payload, ...commonService.insertTimestamp() })
};

module.exports = chargerService;
