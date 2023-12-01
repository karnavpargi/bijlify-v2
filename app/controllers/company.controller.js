const { InternalError, DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('../services/common.service');
const companyService = require('../services/company.service');
const { companySchema } = require('../models/company.model');
const logger = require('../common/logger')('company.controller');

const companies = db.collection(DB_NAME.COMPANIES);

const companyController = {
  list: async (payload = { name: '' }) => {
    try {
      const data = await companies.find(payload).toArray();
      const counts = await companies.countDocuments();
      return { data, counts };
    } catch (error) {
      return InternalError;
    }
  },
  save: async (req, res) => {
    try {
      const { body } = req;
      const bodyData = Object.assign(companySchema, {
        ...body,
        companyId: await commonService.generateCompanyId()
      });
      logger.verbose('company bodyData', bodyData);
      const response = await companyService.save(bodyData);
      logger.verbose('company response', response);
      return res.status(201).send({ data: response, message: 'Created.' });
    } catch (error) {
      logger.error(error);
      return res.status(500).send({ message: error.message || error });
    }
  }
};

module.exports = companyController;
