const { manufacturerSchema } = require('../models/manufacturer-vehicle.model');
const commonService = require('../services/common.service');
const manufacturerService = require('../services/manufacturer.service');

const logger = require('../common/logger')('manufacturer.controller');

const manufacturerController = {
  list: async (req, res) => {
    logger.verbose('list');
    const response = await manufacturerService.list();
    if (res && res.send) {
      return res.send({ data: response });
    }
    return response;
  },
  save: async (req, res) => {
    try {
      const { body } = req;
      const bodyData = Object.assign(manufacturerSchema, {
        ...body,
        manufacturerId: await commonService.generateManufacturerId()
      });
      logger.verbose('manufacturer bodyData', bodyData);
      const response = await manufacturerService.save(bodyData);
      logger.verbose('manufacturer response', response);
      return res.status(201).send({ data: response, message: 'Created.' });
    } catch (error) {
      logger.error('save error', `${error}`);
      return res.status(500).send({ message: error.message || error });
    }
  }
};

module.exports = manufacturerController;
