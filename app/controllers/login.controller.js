// eslint-disable-next-line import/no-extraneous-dependencies
// const bcrypt = require('bcrypt');

const { signJWT, GenerateOTP, VerifyOTP, verifyJWT } = require('../common/commonFunctions');
const db = require('../configs/db.configs.mysql');
const { InternalError } = require('../common/stringCodes');
const logger = require('../common/logger')('login.controller');

const sendOtp = (req, res) => {
  const { mobile } = req.params;
  if (mobile && mobile.length === 10) {
    db.query(`SELECT status, id, user_id FROM db_user WHERE contact_no='${mobile}'`, async (e, checkUser) => {
      if (e) {
        logger.error('sendOtp:e', e);
        return res.status(500).send({ message: e.message || e || InternalError });
      }

      if (!checkUser || !checkUser.length) {
        let userId = 1;
        db.query('SELECT user_id FROM db_user ORDER BY CAST(user_id as unsigned) DESC LIMIT 1', (_e, user) => {
          if (_e) return res.status(500).send({ message: _e.message || _e || InternalError });
          if (user.length) userId = +user[0].user_id + 1;
          db.query(`INSERT INTO db_user (contact_no, user_id) VALUES('${mobile}', ${userId})`, async (e1, d) => {
            if (e1) return res.status(500).send({ message: e1.message || e1 || InternalError });
            if (d.affectedRows > 0) {
              const response = await GenerateOTP(mobile);
              if (response.Status === 'Success') {
                const token = signJWT({ sessionId: response.Details, id: d.insertId });
                return res.status(200).send({ token, message: 'OTP generated successfully.' });
              }
            }
            return res.status(500).send({ message: `${InternalError} when insert data.` });
          });
        });
      }
      const response = await GenerateOTP(mobile);
      if (response.Status === 'Success') {
        const token = signJWT({ sessionId: response.Details, id: checkUser[0].id });
        return res.status(200).send({ token, message: 'OTP generated successfully.' });
      }
      return res.status(500).send({ message: 'users/otp_send/fail' });
    });
  }
};

// eslint-disable-next-line consistent-return
const verifyOtp = async (req, res) => {
  const { fcmToken, deviceId, otp } = req.body;
  let message = '';
  // if (!fcmToken) message = 'Please provide fcmToken.';
  if (!deviceId) message = 'Please provide deviceId.';
  if (!otp) message = 'Please provide otp.';

  if (message !== '') {
    return res.status(500).send({ message });
  }
  const response = await VerifyOTP(req.decoded.sessionId, otp);
  logger.debug('VerifyOTP: ', response);
  if (response.Status === 'Success') {
    logger.debug(req.decoded);
    db.query(`SELECT contact_no, status from db_user WHERE id='${req.decoded.id}'`, (e, d) => {
      if (e) {
        logger.error('verifyOtp error:', e);
        return res.status(500).send({ message: e.message || e || InternalError });
      }
      logger.verbose('data: ', d);
      if (d.length === 1) {
        let mobile = d[0].contact_no;
        if (req.decoded.mobile) mobile = req.decoded.mobile;
        const payload = signJWT({ mobile, id: req.decoded.id });
        logger.verbose('verifyOtp token: ', payload);

        let query = 'UPDATE db_user SET';
        if (mobile) query += ` contact_no='${mobile}'`;
        if (fcmToken) query += `, fcmtoken='${fcmToken}'`;
        db.query(
          `${query}, device_id='${deviceId}', uuid='${payload}', status='Active' WHERE id='${req.decoded.id}'`,
          (er, d) => {
            if (er) return res.status(500).send({ message: er.message || er || InternalError });
            logger.verbose(payload);
            return res.status(200).send({ token: payload, message: 'User loggedin successful.' });
          }
        );
      } else {
        logger.debug('User not found.');
        return res.status(500).send({ message: 'User not found.' });
      }
    });
  } else {
    logger.debug('Number verification failed');
    return res.status(500).send({ message: 'Number verification failed' });
  }
};

const verify = (req, res) => {
  try {
    const decoded = verifyJWT(req.query.uuid);
    logger.silly('verify decoded: ', decoded);
    db.query(`UPDATE db_user SET email_id='${decoded.email}', status='Active' WHERE id='${decoded.id}'`, (e, d) => {
      if (e) {
        logger.error('verify: ', e);
        return res.status(500).send('<h1>Something went worng.</h2>');
      }
      logger.silly('verify: ', d);
      return res.status(200).send('<h1>User verification Successful.</h2>');
    });
  } catch (error) {
    logger.error('Error: ', error);
    return res.status(500).send('<h1>Something went worng.</h2>');
  }
};
// const loginCheck = async (req, res) => {
//   const decoded = (await verifyJWT(req.body.uuid).catch(() => {})) || {};
//   if (decoded) {
//     const sql = `SELECT * FROM users WHERE status='Active' AND username='${decoded.username}' AND id=${decoded.user_id}`;

//     db.query(sql, (e, d) => {
//       if (!e && d && d.length > 0) {
//         res.json({
//           status: 200,
//           message: 'success',
//           full_name: decoded.full_name,
//           roles: d[0].roles,
//           description: 'Login Successful !!'
//         });
//       } else {
//         res.json({
//           status: 200,
//           message: 'failure',
//           description: 'Invalid Token !!'
//         });
//       }
//     });
//   } else {
//     res.json({
//       status: 200,
//       message: 'failure',
//       description: 'Invalid Token !!'
//     });
//   }
// };

// const login = (req, res) => {
//   let query = null;
//   if (req.body.usernamae) query = `username = '${req.body.username}'`;
//   if (req.body.mobile) query = `mobile = '91${req.body.mobile}'`;

//   const sql = `SELECT * FROM users WHERE status='Active' AND ${query}`;
//   db.query(sql, (e, d) => {
//     if (!e && d && d.length > 0) {
//       if (!d[0].password || d[0].password.length === 0) {
//         if (req.body.password.length > 4) {
//           const hash = bcrypt.hashSync(req.body.password, 10);
//           db.query(`UPDATE users SET password='${hash}' WHERE id=${d[0].id}`, () => {
//             res.json({
//               status: 200,
//               message: 'success',
//               description: 'New Password set successfully !!'
//             });
//           });
//         } else {
//           res.json({
//             status: 200,
//             message: 'failure',
//             description: 'Invalid New Password (Length < 4) !!'
//           });
//         }
//       } else if (bcrypt.compareSync(req.body.password, d[0].password)) {
//         const uuid = signJWT({ username: d[0].username, user_id: d[0].id, full_name: d[0].full_name });
//         db.query(`UPDATE users SET uuid='${uuid}' WHERE id='${d[0].id}'`, (err) => {
//           if (!err) {
//             res.json({
//               status: 200,
//               uuid,
//               message: 'success',
//               full_name: d[0].full_name,
//               roles: d[0].roles,
//               description: 'Login Successful !!'
//             });
//           } else {
//             res.json({
//               status: 200,
//               message: 'failure',
//               description: 'Invalid Username or Password 1 !!'
//             });
//           }
//         });
//       } else {
//         res.json({
//           status: 200,
//           message: 'failure',
//           description: 'Invalid Username or Password 2 !!'
//         });
//       }
//     } else {
//       res.json({
//         status: 200,
//         message: 'failure',
//         description: 'Invalid Username or Password 3 !!'
//       });
//     }
//   });
// };

module.exports = { sendOtp, verifyOtp, verify };
