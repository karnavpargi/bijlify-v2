const logger = require('../common/logger')('common.service');

const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');

const defaultLeadingZeros = process.env.LEADING_ZERO || 7;
const charger = db.collection(DB_NAME.CHARGERS);
const company = db.collection(DB_NAME.COMPANIES);
const manufacturers = db.collection(DB_NAME.MANUFACTURERS);

const commonService = {
  isInt: (n) => Number(n) === n && n % 1 === 0,
  isFloat: (n) => Number(n) === n && n % 1 !== 0,
  insertTimestamp: () => ({ createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  updateTimestamp: () => ({ updatedAt: new Date().toISOString() }),
  /*
  Functions to generate unique Ids
  */
  addleadingZero: (num, leadingZero = defaultLeadingZeros) => num.toString().padStart(leadingZero, '0'),
  generateChargerId: async () => {
    const PREFIX = 'CH';

    logger.verbose('generateChargerId');
    const [{ chargerId }] = await charger
      .find()
      .sort({ chargerId: '-1' })
      .limit(1)
      .project({ _id: 0, chargerId: 1 })
      .toArray();
    if (chargerId && chargerId.includes('CH')) {
      const lastNumber = chargerId.slice(2);
      return `${PREFIX}${commonService.addleadingZero(`${Number(lastNumber) + 1}`, defaultLeadingZeros)}`;
    }
    return `${PREFIX}${commonService.addleadingZero('1', defaultLeadingZeros)}`;
  },
  generateCompanyId: async () => {
    try {
      const PREFIX = 'CMP';
      const leadingZero = process.env.LEADING_ZERO || 7;
      logger.verbose('generateCompanyId');
      const [{ companyId }] = await company
        .find()
        .sort({ companyId: '-1' })
        .limit(1)
        .project({ _id: 0, companyId: 1 })
        .toArray();

      if (companyId && companyId.includes('CMP')) {
        const lastNumber = companyId.slice(3);
        return `${PREFIX}${commonService.addleadingZero(`${Number(lastNumber) + 1}`, leadingZero)}`;
      }
      return `${PREFIX}${commonService.addleadingZero('1', leadingZero)}`;
    } catch (error) {
      logger.error('generateCompanyId', error);
      return error;
    }
  },
  generateStationId: async () => {
    const PREFIX = 'ST';
    const leadingZero = process.env.LEADING_ZERO || 7;
    const [{ stationId }] = await company
      .aggregate([
        { $unwind: { path: '$stations', preserveNullAndEmptyArrays: true } },
        { $sort: { 'stations.stationId': -1 } },
        { $project: { _id: 0, stationId: '$stations.stationId' } },
        { $limit: 1 }
      ])
      .toArray();
    logger.verbose('generateStationId', stationId);
    if (stationId && stationId.includes('ST')) {
      const lastNumber = stationId.slice(2);
      return `${PREFIX}${commonService.addleadingZero(`${Number(lastNumber) + 1}`, leadingZero)}`;
    }
    return `${PREFIX}${commonService.addleadingZero('1', leadingZero)}`;
  },

  getLastVehicleId: () =>
    manufacturers
      .aggregate([
        { $unwind: { path: '$vehicles', preserveNullAndEmptyArrays: true } },
        { $sort: { 'vehicles.vehicleId': -1 } },
        { $project: { _id: 0, vehicleId: '$vehicles.vehicleId' } },
        { $limit: 1 }
      ])
      .toArray(),
  generateVehicleId: async () => {
    const PREFIX = 'VH';
    const leadingZero = process.env.LEADING_ZERO || 7;
    const [vehicle] = await commonService.getLastVehicleId();
    logger.verbose('generatevehicleId', vehicle);

    if (vehicle && vehicle.vehicleId) {
      const lastNumber = vehicle.vehicleId.slice(2);
      return `${PREFIX}${commonService.addleadingZero(`${Number(lastNumber) + 1}`, leadingZero)}`;
    }
    return `${PREFIX}${commonService.addleadingZero('1', leadingZero)}`;
  },

  getLastManufacturerId: () =>
    manufacturers.find().sort({ manufacturerId: '-1' }).limit(1).project({ _id: 0, manufacturerId: 1 }).toArray(),
  generateManufacturerId: async () => {
    const PREFIX = 'MF';
    const leadingZero = process.env.LEADING_ZERO || 4;
    const [manufacturer] = await commonService.getLastManufacturerId();
    logger.verbose('generateManufacturerId', manufacturer);
    if (manufacturer && manufacturer.manufacturerId) {
      const lastNumber = manufacturer.manufacturerId.slice(2);
      return `${PREFIX}${commonService.addleadingZero(`${Number(lastNumber) + 1}`, leadingZero)}`;
    }
    return `${PREFIX}${commonService.addleadingZero('1', leadingZero)}`;
  }
};

module.exports = commonService;
