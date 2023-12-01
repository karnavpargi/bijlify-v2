const { ObjectId } = require('mongodb');
const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');
const commonService = require('./common.service');
const logger = require('../common/logger')('station.service');

const companies = db.collection(DB_NAME.COMPANIES);

const stationService = {
  list: () =>
    companies
      .aggregate([
        { $unwind: { path: '$stations', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'chargers',
            localField: 'stations.chargerIds',
            foreignField: 'chargerId',
            as: 'stations.chargers'
          }
        },
        {
          $project: {
            stationId: '$stations.stationId',
            name: '$stations.name',
            address1: '$stations.address1',
            address2: '$stations.address2',
            city: '$stations.city',
            state: '$stations.state',
            pincode: '$stations.pincode',
            location: '$stations.location',
            chargers: '$stations.chargers'
          }
        },
        { $unwind: { path: '$chargers' } },
        {
          $group: {
            _id: { _id: '$stationId', gunType: '$chargers.gunType', connectorStatus: '$chargers.connectorStatus' },
            count: { $sum: 1 },
            data: { $first: '$$ROOT' }
          }
        },
        {
          $project: {
            data: '$data',
            chargers: { gunType: '$_id.gunType', connectorStatus: '$_id.connectorStatus', count: '$count' }
          }
        },
        {
          $group: {
            _id: '$data.stationId',
            stationId: { $first: '$data.stationId' },
            name: { $first: '$data.name' },
            address1: { $first: '$data.address1' },
            address2: { $first: '$data.address2' },
            city: { $first: '$data.city' },
            state: { $first: '$data.state' },
            pincode: { $first: '$data.city' },
            location: { $first: '$data.location' },
            chargerCounts: { $push: '$chargers' }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray(),
  detailsById: (payload) =>
    companies
      .aggregate([
        { $match: { 'stations.stationId': payload.stationId } },
        {
          $project: {
            stations: {
              $filter: { input: '$stations', as: 'st', cond: { $eq: ['$$st.stationId', payload.stationId] } }
            }
          }
        },
        { $unwind: { path: '$stations', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'chargers',
            localField: 'stations.chargerIds',
            foreignField: 'chargerId',
            as: 'stations.chargers'
          }
        },
        {
          $project: {
            stationId: '$stations.stationId',
            name: '$stations.name',
            address1: '$stations.address1',
            address2: '$stations.address2',
            city: '$stations.city',
            state: '$stations.state',
            pincode: '$stations.pincode',
            amenities: '$stations.amenities',
            images: '$stations.images',
            location: '$stations.location',
            chargers: '$stations.chargers'
          }
        },
        {
          $project: {
            stationId: 1,
            name: 1,
            address1: 1,
            address2: 1,
            city: 1,
            state: 1,
            pincode: 1,
            amenities: 1,
            images: 1,
            location: 1,
            chargers: {
              chargerId: 1,
              gunType: 1,
              capacity: 1,
              tariff: 1,
              connectorStatus: 1
            }
          }
        }
      ])
      .toArray(),
  save: (companyId, query) => {
    logger.verbose('save query', query);
    return companies.updateOne(
      { _id: new ObjectId(companyId) },
      {
        $push: { stations: { ...query, ...commonService.insertTimestamp() } }
      }
    );
  }
};

module.exports = stationService;
