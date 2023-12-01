const logger = require('../common/logger')('company-validator');
const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');

db.createCollection(DB_NAME.COMPANIES, {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'companyId', 'stations.location', 'stations.stationId', 'stations.name'],
      properties: {
        name: { bsonType: 'string' },
        address1: { bsonType: 'string' },
        address2: { bsonType: 'string' },
        city: { bsonType: 'string' },
        state: { bsonType: 'string' },
        pincode: { bsonType: 'string' },
        stations: {
          bsonType: 'array',
          properties: {
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required"
            },
            address1: { bsonType: 'string' },
            address2: { bsonType: 'string' },
            city: { bsonType: 'string' },
            state: { bsonType: 'string' },
            pincode: { bsonType: 'string' },
            location: {
              bsonType: 'object',
              required: ['type', 'coordinates'],
              properties: {
                type: { bsonType: 'string', enum: ['Point'] },
                coordinates: {
                  bsonType: 'array',
                  minItems: 2,
                  maxItems: 2,
                  items: [
                    { bsonType: 'double', minimum: -180, maximum: 180 },
                    { bsonType: 'double', minimum: -90, maximum: 90 }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
})
  .then(() => {
    db.records.createIndex({ companyId: 1, 'stations.stationId': 1 }, { unique: true });
    db.records.createIndex({ 'stations.location': 1 }, {});
  })
  .catch((error) => {
    logger.error(error);
  });
