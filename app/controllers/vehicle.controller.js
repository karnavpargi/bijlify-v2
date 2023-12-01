const vehicleService = require('../services/vehicle.service');
const logger = require('../common/logger')('vehicle.controller');

const vehicleController = {
  list: async (query) => {
    const { manufacturerId } = query;
    logger.verbose('list');
    const response = await vehicleService.list(manufacturerId);
    return response;
  },
  save: async (req, res) => {
    try {
      const { manufacturerId, vehicles } = req.body;

      if (vehicles.length) {
        const response = await vehicleService.save(manufacturerId, vehicles);
        return res.status(201).send({ message: 'Created.', data: response });
      }
      return res.status(500).send({ message: 'send valid vehicle details' });
    } catch (error) {
      logger.error('save', `${error}`);
      return res.status(500).send({ message: error.message || error });
    }
  }
};

module.exports = vehicleController;
