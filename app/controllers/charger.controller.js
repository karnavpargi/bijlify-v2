const { InternalError } = require('../common/stringCodes');
const chargerService = require('../services/charger.service');
const { chargerSchema, tarrifConfigSchema } = require('../models/charger.model');
const commonService = require('../services/common.service');
const logger = require('../common/logger')('charger.controller');

const chargerController = {
  list: async () => {
    try {
      const data = await chargerService.list();
      return { data: data.payload, totalCounts: data.counts };
    } catch (error) {
      return error.message || error || InternalError;
    }
  },
  save: async (req, res) => {
    try {
      const { body } = req;
      const bodyData = Object.assign(chargerSchema, {
        ...body,
        chargerId: await commonService.generateChargerId(),
        tariffConfig: body.tariffConfig && body.tariffConfig.length ? body.tariffConfig : [tarrifConfigSchema]
      });
      logger.verbose('save bodyData', bodyData);
      const response = await chargerService.save(bodyData);
      logger.verbose('save response', response);
      return res.send({ data: response, message: 'Created.' });
    } catch (error) {
      return res.status(500).send({ message: error.message || error });
    }
  }
};

module.exports = chargerController;
