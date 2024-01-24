const mysql = require('mysql');
const logger = require('../common/logger')('db.configs.mysql');

const pool = mysql.createPool({
  host: process.env.MYSQL_DATABASE_HOST || "bijlify-v2",
  user: process.env.MYSQL_DATABASE_USERNAME,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  port: 3306
});

module.exports = {
  query: (...argument) => {
    let sqlArgs = [];
    const args = [];
    argument.forEach((e) => args.push(e));

    const callback = args[args.length - 1] ? args[args.length - 1] : () => {}; // last arg is callback
    logger.info('callback: ', callback);
    // eslint-disable-next-line consistent-return
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error('err: ', err);
        return callback(err);
      }
      if (args.length > 2) {
        // eslint-disable-next-line prefer-destructuring
        sqlArgs = args[1];
      }
      logger.debug('query: ', args[0]);
      connection.query(args[0], sqlArgs, (qErr, results) => {
        connection.release(); // always put connection back in pool after last query
        if (qErr) {
          logger.error('qErr: ', qErr);
          return callback(err);
        }
        logger.silly({ args: args[0], sqlArgs, results });
        return callback(null, results);
      });
    });
  }
};
