const logger = require('../common/logger')('company-validator');
const { DB_NAME } = require('../common/stringCodes');
const db = require('../configs/db.configs.mongo');

db.createCollection(DB_NAME.CHARGERS, {
  validator: {
    bsonType: 'object',
    required: ['name', 'chargerId'],
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        chargerId: { bsonType: 'string' },
        name: { bsonType: 'string' }
      }
    }
  }
})
  .then(() => {
    db.records.createIndex({ chargerId: 1 }, { unique: true });
  })
  .catch((error) => {
    logger.error(error);
  });
