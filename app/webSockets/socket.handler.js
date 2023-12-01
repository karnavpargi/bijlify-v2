const urlParser = require('url');
const { handleWebSocketPayload } = require('../controllers/main.controller');
const { wss } = require('../configs/socket.config');
const { setClient, removeClient } = require('../common');
const logger = require('../common/logger')('socket.handler');

wss.on('connection', async (socket, request) => {
  try {
    const { query } = urlParser.parse(request.url, true);
    setClient(query.uuid, socket);
    logger.debug(`socket:uuid: ${query.uuid}`);

    socket.on('open', (event) => {
      logger.debug(`OPENED CONNECTION ${event}`);
    });

    socket.on('message', async (message) => {
      try {
        const payload = JSON.parse(message);
        if (Array.isArray(payload) && payload.length >= 3) {
          try {
            logger.debug('socket:payload', payload);
            const parsedUrl = urlParser.parse(request.url, true);
            logger.debug('socket:message', parsedUrl);
            if (!!payload && typeof payload[1] === 'string') {
              return socket.send(
                JSON.stringify([
                  200,
                  payload[1],
                  await handleWebSocketPayload(payload, parsedUrl.query),
                  { status: 'Data retrieved' }
                ])
              );
            }
            return socket.send(JSON.stringify([500, payload[1], null, { status: 'Query invalid.' }]));
          } catch (error) {
            logger.error(`message catch error: ${error}`);
            removeClient(query.uuid);
            return socket.send(JSON.stringify([500, null, null, { status: error.message || error }]));
          }
        } else {
          return socket.send(JSON.stringify([500, payload[1] || null, null, { status: 'Invalid query' }]));
        }
      } catch (error) {
        return socket.send(JSON.stringify([500, message.toString() || null, null, { status: error.message || error }]));
      }
    });

    socket.on('close', (ws) => {
      removeClient(query.uuid);
      logger.info(`socket closed: ${ws}`);
    });

    socket.on('error', (event) => {
      logger.error(`socket error: ${event}`);
    });
  } catch (error) {
    logger.error(`connection catch error: ${error}`);
  }
});

module.exports = wss;
