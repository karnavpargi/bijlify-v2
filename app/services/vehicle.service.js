const { ObjectId } = require('mongodb');

const logger = require('../common/logger')('manufacturer.service');
const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('./common.service');
const { vehicleSchema } = require('../models/manufacturer-vehicle.model');

const manufacturers = db.collection(DB_NAME.MANUFACTURERS);
const vehicleService = {
  list: (manufacturerId) => {
    logger.verbose('list', { manufacturerId });
    return manufacturers
      .aggregate([
        { $match: { _id: new ObjectId(manufacturerId), status: 1 } },
        { $unwind: { path: '$vehicles' } },
        { $match: { 'vehicles.status': 1 } },
        { $project: { _id: 0, name: '$vehicles.name', vehicleId: '$vehicles.vehicleId' } }
      ])
      .toArray();
  },
  save: async (manufacturerId, vehicles) => {
    const [vehicle] = await commonService.getLastVehicleId();
    let defaultVehicleNumber = '0';
    if (vehicle && vehicle.vehicleId) {
      defaultVehicleNumber = vehicle.vehicleId.slice(2);
    }
    await vehicles.forEach(async (ele, index) => {
      const query = {
        ...vehicleSchema,
        ...ele,
        vehicleId: `VH${await commonService.addleadingZero(Number(defaultVehicleNumber) + index + 1)}`,
        ...commonService.insertTimestamp()
      };
      logger.verbose('save query', query);
      await manufacturers.updateOne({ _id: new ObjectId(manufacturerId) }, { $push: { vehicles: query } });
    });
    logger.verbose('save', { manufacturerId });
    return true;
  }
};

module.exports = vehicleService;
