const { GenerateOTP, signJWT, sendMail } = require('../common');
const logger = require('../common/logger')('user.service.ts');
const db = require('../configs/db.configs.mysql');

const userService = {
  profile: async ({ decoded, mobile, email, fullName, gstNo }) => {
    let token = '';
    if (mobile) {
      const response = await GenerateOTP(mobile);
      if (response.Status === 'Success') {
        token = signJWT({ sessionId: response.Details, mobile, userId: decoded.userId, id: decoded.id });
      }
    }
    if (email) {
      const uuid = signJWT({ userId: decoded.userId, id: decoded.id, email });
      const info = sendMail({
        to: email,
        subject: 'Bijlify Email Verification',
        html: `<h1>Email Verification</h1><p>Please, click on below link to Verify your Bijlify Account</p> <a href="https://${process.env.BACKEND_URL}/users/verify?uuid=${uuid}">Verify Account</a>`
      });
      logger.debug(info);
    }
    let query = 'UPDATE db_user SET ';
    if (fullName !== undefined) query += ` fullname='${fullName}' `;
    if (gstNo !== undefined) query += `${fullName ? ',' : ''}gst_no='${gstNo}'`;
    query += ` WHERE id='${decoded.id}'`;
    db.query(query, (e) => logger.error('Update profile', e));
    return token;
  },
  getProfile: ({ id }) => {
    const query = `SELECT * from db_user WHERE id='${id}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, data) => {
        if (err) reject(err);
        return resolve(data);
      });
    });
  }
};

module.exports = userService;
