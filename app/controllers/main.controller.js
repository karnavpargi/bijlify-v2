/* eslint-disable global-require */
const { decode } = require('jsonwebtoken');
const logger = require('../common/logger')('main.controller');
const { InternalError } = require('../common/stringCodes');

// [ControllerName, MethodName, paylod]
const handleWebSocketPayload = (payload, query) =>
  new Promise((resolve, reject) => {
    const decoded = decode(query.uuid);
    const url = `./${payload[0]}.controller`;
    logger.debug(`handleWebSocketPayload:url: ${url}`);
    try {
      // eslint-disable-next-line import/no-dynamic-require
      const controller = require(url);
      logger.debug(`handleWebSocketPayload:method: controller.${payload[1]}(${JSON.stringify(payload[2])})`, decoded);
      resolve(controller[payload[1]](payload[2], decoded));
    } catch (error) {
      logger.error(`handleWebSocketPayload: ${error}`);
      reject(InternalError);
    }
  });

module.exports = { handleWebSocketPayload };
