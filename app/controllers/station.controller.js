const stationService = require('../services/station.service');
const stationSchema = require('../models/station.model');
const commonService = require('../services/common.service');
const logger = require('../common/logger')('station.controller');

const stationController = {
  // Home-screen-map-view
  list: async (payload) => {
    const response = await stationService.list(payload);
    return { data: response };
  },
  // Station-details-full
  detailsById: async (payload) => {
    if (!payload.stationId) {
      return { message: 'Please send valid station Id.' };
    }
    const response = await stationService.detailsById(payload);
    return { data: response };
  },
  save: async (req, res) => {
    try {
      const { station, companyId } = req.body;
      logger.verbose('station', { station, companyId });
      if (station.location && station.location.coordinates) {
        const { coordinates } = station.location;
        if (coordinates.length === 2) {
          if (!commonService.isFloat(coordinates[0]) || !commonService.isFloat(coordinates[1])) {
            return res.status(500).send({ message: 'send valid coordinates', data: coordinates });
          }
        } else {
          return res.status(500).send({ message: 'send valid coordinates' });
        }
      }
      const stationPayload = Object.assign(stationSchema, {
        ...station,
        location: station.location
          ? Object.assign(stationSchema.location, { ...station.location })
          : { ...stationSchema.location },
        stationId: await commonService.generateStationId()
      });
      logger.verbose('save stationPayload', stationPayload);
      const response = await stationService.save(companyId, stationPayload);
      logger.verbose('save response', response);
      return res.status(201).send({ data: response, message: 'Created.' });
    } catch (error) {
      logger.error('save', error);
      return res.status(500).send({ message: error.message || error });
    }
  }
};

module.exports = stationController;
