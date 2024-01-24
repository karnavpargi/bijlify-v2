const { MongoClient } = require('mongodb');
const logger = require('../common/logger')('db.configs.mongo');

const client = new MongoClient(process.env.MONGO_DATABASE_HOST || "bijlify-v2");
client.connect();

client.on('close', () => {
  logger.info('Mongo Connection closed.');
});
client.on('connection', (stream) => {
  logger.info('MongoDB Connection Established: ', stream);
});
client.on('error', (stream) => {
  logger.info('MongoDB Connection error: ', stream);
});

const db = client.db(process.env.MONGODB_NAME);

module.exports = db;
