/* eslint-disable no-extend-native */
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const logger = require('./logger')('commonFunctions');

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getUniqueId = () => Date.now().toString();

Date.prototype.addMonths = function (M) {
  this.setMonth(this.getMonth() + M);
  return this;
};

Date.prototype.addDays = function (d) {
  this.setDate(this.getDate() + d);
  return this;
};

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

Date.prototype.addMinutes = function (m) {
  this.setMinutes(this.getMinutes() + m);
  return this;
};

Date.prototype.addSeconds = function (s) {
  this.setSeconds(this.getSeconds() + s);
  return this;
};

const getCurrentTime = () => new Date(Date.now()).addMinutes(330).toISOString();

const signJWT = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });

const verifyAPIJWT = (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`verifyAPIJWT:error: ${err}`);
      return res.status(401).send({ message: 'Unauthorized request' });
    }
    req.decoded = decoded;
    return next();
  });
};
function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

const GenerateOTP = (mobile) =>
  new Promise((resolve, reject) => {
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/91${mobile}/AUTOGEN/Bijlify_Login_OTP`;
    fetch(url)
      .then((buffer) => buffer.json())
      .then((res) => resolve(res))
      .catch((err) => {
        logger.error(`GenerateOTP:error: ${err}`);
        return reject(err);
      });
  });

const VerifyOTP = (sessionId, otp) =>
  new Promise((resolve, reject) => {
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    fetch(url)
      .then((buffer) => buffer.json())
      .then((res) => resolve(res))
      .catch((err) => {
        logger.error(`VerifyOTP:error: ${err}`);
        return reject(err);
      });
  });

const SuccessResponse = (res, { pagination, statusCode = 200, message = '', data = [] }) =>
  res.status(statusCode).send({
    statusCode,
    status: true,
    message,
    data,
    pagination
  });

const ErrorResponse = (res, { statusCode = 500, message = '', errors = [] }) =>
  res.status(statusCode).send({
    statusCode,
    status: false,
    message,
    errors
  });

const GlobalResponse = (resHealth, resType, resAdInfo, responsePayload = {}) =>
  JSON.stringify([resHealth, resType, resAdInfo, responsePayload || {}]);

const clients = {};

const setClient = (id, socket) => {
  clients[id] = socket;
  return clients[id];
};

const getClient = (id) => {
  if (Object.keys(clients).length > 0 && clients[id]) {
    logger.debug(`getClient: ${id}`);
    return clients[id];
  }
  return {
    send: (payload) => {
      logger.debug(`getClient: ${payload}`);
      return payload;
    }
  };
};

const sendToClient = (id, payload) => getClient(id).send(payload);

const removeClient = (id) => {
  logger.debug(`removeClient: ${id}`);
  if (clients[id]) {
    delete clients[id];
    return true;
  }
  return false;
};

const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: 'noreply@bijlifynow.com', // generated ethereal user
    pass: 'Bijlify@123' // generated ethereal password
  }
});

const sendMail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: '"No-reply Bijlify" <noreply@bijlifynow.com>',
    to,
    subject,
    text,
    html
  });
  return info;
};
module.exports = {
  capitalizeFirstLetter,
  signJWT,
  verifyAPIJWT,
  verifyJWT,
  GenerateOTP,
  VerifyOTP,
  getUniqueId,
  getCurrentTime,
  SuccessResponse,
  ErrorResponse,
  sendToClient,
  GlobalResponse,
  setClient,
  getClient,
  removeClient,
  sendMail
};
