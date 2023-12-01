const urlParser = require('url');
const { WebSocketServer, OPEN, CLOSING, CLOSED } = require('ws');
const db = require('./db.configs.mysql');
const { GlobalResponse, sendToClient, verifyJWT } = require('../common');
const { AUTHORIZE } = require('../common/stringCodes');
const logger = require('../common/logger')('socket.config');

const wss = new WebSocketServer({
  noServer: true,
  clientTracking: true,
  path: '/bijlify',
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
  verifyClient: async (info, cb) => {
    let uuid;
    if (info.req.headers && info.req.headers.uuid) {
      uuid = info.req.headers.uuid;
    } else {
      const { query } = urlParser.parse(info.req.url, true);
      uuid = query.uuid;
    }
    try {
      const decoded = verifyJWT(uuid);
      logger.debug('verifyClient:decoded', decoded);
      if (decoded) {
        db.query(`SELECT id FROM db_user WHERE id='${decoded.id}' AND status='Active'`, (e, d) => {
          if (e) {
            cb(false);
            logger.error('verifyClient', e);
            return sendToClient(uuid, GlobalResponse(401, AUTHORIZE, 'Invalid Username or Password !!', ''));
          }
          if (d && d.length > 0) {
            cb(true);
            logger.debug('verifyClient:Connection Successful !! :', d.length);
            return sendToClient(uuid, GlobalResponse(200, AUTHORIZE, 'Connection Successful !!', ''));
          }
          cb(false);
          logger.debug('verifyClient:User not found. !!');
          return sendToClient(uuid, GlobalResponse(401, AUTHORIZE, 'User not found.', ''));
        });
      } else {
        logger.debug('verifyClient:Invalid Username or Password !!');
        sendToClient(uuid, GlobalResponse(401, AUTHORIZE, 'Invalid Username or Password !!', ''));
        cb(false);
      }
    } catch (error) {
      cb(true);
      logger.debug('verifyClient:error:', error);
      sendToClient(uuid, GlobalResponse(401, AUTHORIZE, 'Unauthorized token!!', ''));
      cb(false);
    }
  }
});

// wss.on('headers', async (ws, request) => {
//   const parsedUrl = urlParser.parse(request.url, true);
//   const ip = request.socket.remoteAddress || request.headers['x-forwarded-for'].split(',')[0].trim();
// });

module.exports = { wss, OPEN, CLOSING, CLOSED };
