const { createLogger, transports, format } = require('winston');

// { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 };
const myFormat = format.printf(({ level, message, label, timestamp }) => {
  let msg = message;
  try {
    msg = JSON.stringify(msg.length > 1 ? msg : msg[0]);
  } catch (e) {}
  return `${timestamp} [${label}] ${level}: ${msg}`;
});

const { combine, timestamp, label } = format;
const logger = (lbl) => {
  const logs = createLogger({
    format: combine(label({ label: lbl }), timestamp(), myFormat),
    transports: [
      new transports.Console({
        level: process.env.CONSOLE_LOG_LEVEL
      }),
      new transports.File({ filename: 'logs/bijlify.log', level: process.env.FILE_LOG_LEVEL })
    ]
  });

  return {
    error: (...p) => {
      logs.error(p);
    },
    warn: (...p) => {
      logs.warn(p);
    },
    info: (...p) => {
      logs.info(p);
    },
    http: (...p) => {
      logs.http(p);
    },
    verbose: (...p) => {
      logs.verbose(p);
    },
    debug: (...p) => {
      logs.debug(p);
    },
    silly: (...p) => {
      logs.silly(p);
    }
  };
};

module.exports = logger;
