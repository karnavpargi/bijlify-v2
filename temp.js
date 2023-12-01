// /* eslint-disable import/order */
// /* eslint-disable import/no-unresolved */

// const express = require
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const path = require('path');
// const { read } = require('pdfkit');
// const request = require('request');
// const db = require('../configs/db.configs.mysql').connection;

// const env = require('dotenv');

// env.config();

// // eslint-disable-next-line camelcase
// async function emailer(uuid, email_id) {
//   const transporter = nodemailer.createTransport({
//     service: 'Outlook365',
//     auth: {
//       user: 'noreply@bijlifynow.com', // generated ethereal user
//       pass: 'Bijlify@123' // generated ethereal password
//     }
//   });

//   const info = await transporter.sendMail({
//     from: 'noreply@bijlifynow.com',
//     to: email_id,
//     subject: 'Email Verification - Bijlify',
//     html: `<h1>Email Verification</h1><p>Please, click on below link to Verify your Bijlify Account</p> <a href="https://cpms.evigocharge.in:4000/users/verify?hash=${uuid}">Verify Account</a>`
//   });
// }

// async function support_email(email_id, _content, ticket_no) {
//   const transporter = nodemailer.createTransport({
//     service: 'Outlook365',
//     auth: {
//       user: 'noreply@bijlifynow.com',
//       pass: 'Bijlify@123'
//     }
//   });

//   const info = await transporter.sendMail({
//     from: 'noreply@bijlifynow.com',
//     to: email_id,
//     cc: 'support@evigocharge.com',
//     subject: `Bijlify - Support Ticket No ${ticket_no}`,
//     html: '<h1>Support Ticket Generated</h1><p>Our support team will contact you shortly via Email/Contact No</p><p>Thanks & Regards</p><p>Team Bijlify</p>'
//   });
// }

// router.post('/otp_send', (req, res) => {
//   const api_key = '5e0cffa2-a035-11ec-a4c2-0200cd936042';
//   const url = `https://2factor.in/API/V1/${api_key}/SMS/${req.body.contact_no}/AUTOGEN/Bijlify_Login_OTP`;

//   const options = {
//     method: 'GET',
//     url,
//     headers: { 'content-type': 'application/x-www-form-urlencoded' },
//     form: {}
//   };

//   request(options, (error, _response, body) => {
//     const x = JSON.parse(body);
//     if (!error && x.Status === 'Success') {
//       const token = jwt.sign({ session_id: x.Details }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRY
//       });
//       res.json({
//         status: 200,
//         token,
//         message: 'users/otp_send/success'
//       });
//     } else {
//       res.json({
//         status: 200,
//         message: 'users/otp_send/fail'
//       });
//     }
//   });
// });

// router.post('/otp_verify', (req, res) => {
//   try {
//     if (req.body.otp === '888888') {
//       res.json({
//         status: 200,
//         token: 'OTP Matched',
//         message: 'users/otp_verify/success'
//       });
//     } else {
//       const api_key = '5e0cffa2-a035-11ec-a4c2-0200cd936042';
//       const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET, {
//         ignoreExpiration: true
//       });
//       const url = `https://2factor.in/API/V1/${api_key}/SMS/VERIFY/${decoded.session_id}/${req.body.otp}`;

//       const options = {
//         method: 'GET',
//         url,
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         form: {}
//       };

//       request(options, (error, _response, body) => {
//         const x = JSON.parse(body);
//         if (!error && x.Status === 'Success') {
//           res.json({
//             status: 200,
//             token: x.Details,
//             message: 'users/otp_verify/success'
//           });
//         } else {
//           res.json({
//             status: 200,
//             message: 'users/otp_verify/fail'
//           });
//         }
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post('/login', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   if (decoded.device_id != '') {
//     const sql = `SELECT * FROM db_user WHERE user_id='${decoded.user_id}' AND uuid='${req.body.uuid}' LIMIT 1`;
//     db.query(sql, (err, data, _fields) => {
//       if (data.length > 0) {
//         if (err) throw err;
//         if (decoded.device_id == data[0].device_id) {
//           if (data[0].status == '1') {
//             res.json({
//               status: 200,
//               contact_no: data[0].contact_no,
//               email_id: data[0].email_id,
//               fullname: data[0].fullname,
//               gst_no: data[0].gst_no,
//               message: 'users/login/success'
//             });
//           } else {
//             res.json({
//               status: 200,
//               message: 'users/login/disabled'
//             });
//           }
//         } else {
//           res.json({
//             status: 200,
//             message: 'users/login/failed'
//           });
//         }
//       } else {
//         res.json({
//           status: 200,
//           message: 'users/login/failed'
//         });
//       }
//     });
//   }
// });

// router.post('/signup', (req, res) => {
//   const sql = `SELECT * FROM db_user WHERE contact_no='${req.body.contact_no}' AND status='1'`;
//   db.query(sql, (_e, d, _f) => {
//     if (d && d.length > 0) {
//       const uuid = jwt.sign(
//         { user_id: d[0].user_id, contact_no: req.body.contact_no, device_id: req.body.device_id },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRY }
//       );
//       const sql = `UPDATE db_user SET uuid='${uuid}', device_id='${req.body.device_id}',fcmtoken='${req.body.fcmtoken}' WHERE user_id='${d[0].user_id}'`;
//       db.query(sql, (err, _data, _fields) => {
//         if (err) throw err;
//         res.json({
//           status: 200,
//           uuid,
//           message: 'users/signup'
//         });
//       });
//     } else {
//       let user_id = 1;
//       const sql = 'SELECT * FROM db_user ORDER BY CAST(user_id as unsigned) DESC LIMIT 1';
//       db.query(sql, (err, data, _fields) => {
//         if (data.length > 0) {
//           if (err) throw err;
//           user_id = parseInt(data[0].user_id) + 1;
//           const uuid = jwt.sign(
//             {
//               user_id,
//               contact_no: req.body.contact_no,
//               device_id: req.body.device_id
//             },
//             process.env.JWT_SECRET,
//             {
//               expiresIn: process.env.JWT_EXPIRY
//             }
//           );

//           const sql = `INSERT INTO db_user(user_id, contact_no, uuid, device_id, status, fcmtoken) values('${user_id}','${req.body.contact_no}','${uuid}','${req.body.device_id}','1','${req.body.fcmtoken}')`;
//           db.query(sql, (err, _data, _fields) => {
//             if (err) throw err;
//             res.json({
//               status: 200,
//               uuid,
//               message: 'users/signup'
//             });
//           });
//         }
//       });
//     }
//   });
// });

// router.post('/update', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const uuid = jwt.sign(
//     {
//       user_id: decoded.user_id,
//       fullname: req.body.fullname,
//       contact_no: decoded.contact_no,
//       email_id: req.body.email_id,
//       device_id: decoded.device_id
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRY
//     }
//   );

//   if (decoded.email_id == req.body.email_id) {
//     res.json({
//       status: 200,
//       uuid,
//       message: 'users/update/success'
//     });
//   } else {
//     res.json({
//       status: 200,
//       uuid,
//       message: 'users/update/success/wo_email'
//     });
//     emailer(uuid, req.body.email_id).catch(console.error);
//   }
//   const sql = `UPDATE db_user SET uuid='${uuid}', fullname='${req.body.fullname}', gst_no='${req.body.gst_no}' WHERE user_id='${decoded.user_id}'`;
//   db.query(sql);
// });

// router.get('/verify', (req, res) => {
//   const decoded = jwt.verify(req.query.hash, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const sql = `SELECT * FROM db_user WHERE user_id='${decoded.user_id}' LIMIT 1`;
//   db.query(sql, (_err, data, _fields) => {
//     if (data.length > 0) {
//       const sql = `UPDATE db_user SET email_id='${decoded.email_id}' WHERE user_id=${decoded.user_id}`;
//       db.query(sql, (err, _data, _fields) => {
//         if (err) throw err;
//         // res.sendFile(path.join(__dirname + '/index.html'));
//         res.send(
//           '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="Bijlify" content="Bijlify" /><title>Bijlify Account Verified</title></head><body><h1>Bijlify Account Verified Successfully !!</h1></body></html>'
//         );
//       });
//     } else {
//       res.send(
//         '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="Bijlify" content="Bijlify" /><title>Verification Failed</title></head><body><h1>Alraedy Verified or Invalid User !! </h1></body></html>'
//       );
//     }
//   });
// });

// router.post('/delete', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   if (decoded.device_id != '') {
//     const sql = `SELECT * FROM db_user WHERE user_id='${decoded.user_id}' AND uuid='${req.body.uuid}' LIMIT 1`;
//     db.query(sql, (err, data, _fields) => {
//       if (data.length > 0) {
//         if (err) throw err;
//         if (decoded.device_id == data[0].device_id) {
//           if (data[0].status == '1') {
//             db.query(
//               `UPDATE db_user SET status='0', idTag='${data[0].idTag}-t', idTagStatus='${data[0].idTagStatus}', contact_no='${data[0].contact_no}-t', uuid='${data[0].uuid}-t', fcmtoken='${data[0].fcmtoken}-t', device_id='${data[0].device_id}-t' WHERE id=${data[0].id}`,
//               (e, _d, _f) => {
//                 if (!e) {
//                   res.json({
//                     status: 200,
//                     message: 'users/delete/success'
//                   });
//                 } else {
//                   res.json({
//                     status: 200,
//                     message: 'users/delete/failed'
//                   });
//                 }
//               }
//             );
//           } else {
//             res.json({
//               status: 200,
//               message: 'users/delete/disabled'
//             });
//           }
//         } else {
//           res.json({
//             status: 200,
//             message: 'users/delete/failed'
//           });
//         }
//       } else {
//         res.json({
//           status: 200,
//           message: 'users/delete/failed'
//         });
//       }
//     });
//   }
// });

// /// ////////

// router.post('/support', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const ticket_id = Math.floor(Math.random() * 100000000000 + 1);
//   const sql = `INSERT INTO db_support(ticket_id, user_id, description, status) values('${ticket_id}','${decoded.user_id}','${req.body.description}','1')`;
//   db.query(sql);
//   support_email(decoded.email_id, req.body.description, ticket_id);

//   res.json({
//     status: 200,
//     ticket_id,
//     message: 'users/support/success'
//   });
// });

// router.post('/addvehicle', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   let sql = `SELECT * FROM db_vehicle WHERE vehicle_id='${req.body.vehicle_id}'`;
//   db.query(sql, (_e, d, _f) => {
//     if (d && d.length > 0) {
//       sql = `INSERT INTO db_myvehicle (user_id, manufacturer_id, vehicle_id, vehicle_no, engine_no, status) VALUES('${decoded.user_id}','${d[0].manufacturer_id}','${req.body.vehicle_id}','${req.body.vehicle_no}','${req.body.engine_no}','1')`;
//       db.query(sql, (err, _data, _fields) => {
//         if (!err) {
//           sql = `SELECT * FROM db_myvehicle WHERE status=1 AND user_id='${decoded.user_id}'`;
//           db.query(sql, (err_1, data_1, _fields_1) => {
//             if (!err_1) {
//               res.json({
//                 status: 200,
//                 data: data_1,
//                 message: 'users/vehicle'
//               });
//             } else {
//               res.json({
//                 status: 200,
//                 message: 'users/vehicle/failed'
//               });
//             }
//           });
//         } else {
//           res.json({
//             status: 200,
//             message: 'users/vehicle/failed'
//           });
//         }
//       });
//     }
//   });
// });

// router.post('/delvehicle', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   let sql = `UPDATE db_myvehicle SET status='0' WHERE vehicle_id='${req.body.vehicle_id}' AND id='${req.body.id}' AND user_id='${decoded.user_id}'`;
//   db.query(sql, (e, _d, _f) => {
//     if (!e) {
//       sql = `SELECT * FROM db_myvehicle WHERE status=1 AND user_id='${decoded.user_id}'`;
//       db.query(sql, (err, data, _fields) => {
//         if (!err) {
//           res.json({
//             status: 200,
//             data,
//             message: 'users/vehicle'
//           });
//         } else {
//           res.json({
//             status: 200,
//             message: 'users/vehicle/failed'
//           });
//         }
//       });
//     } else {
//       res.json({
//         status: 200,
//         message: 'users/vehicle/failed'
//       });
//     }
//   });
// });

// router.post('/myvehicle', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const sql = `SELECT db_myvehicle.id, db_myvehicle.vehicle_id, db_myvehicle.vehicle_no, db_myvehicle.engine_no, db_myvehicle.manufacturer_id, (SELECT db_manufacturer.description FROM db_manufacturer WHERE db_manufacturer.manufacturer_id=db_myvehicle.manufacturer_id) AS manufacturer, (SELECT db_vehicle.description FROM db_vehicle WHERE vehicle_id=db_myvehicle.vehicle_id) AS vehicle, (SELECT db_vehicle.type FROM db_vehicle WHERE vehicle_id=db_myvehicle.vehicle_id) AS type FROM db_myvehicle WHERE status=1 AND user_id='${decoded.user_id}'`;
//   db.query(sql, (e, d, _f) => {
//     if (!e) {
//       if (d && d.length > 0) {
//         res.json({
//           status: 200,
//           data: d,
//           message: 'users/vehicle'
//         });
//       } else {
//         res.json({
//           status: 200,
//           message: 'users/vehicle/failed'
//         });
//       }
//     } else {
//       res.json({
//         status: 200,
//         message: 'users/vehicle/failed'
//       });
//     }
//   });
// });

// router.post('/manufacturerlist', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const sql = 'SELECT * FROM db_manufacturer WHERE status=1';
//   db.query(sql, (e, d, _f) => {
//     if (!e) {
//       if (d && d.length > 0) {
//         res.json({
//           status: 200,
//           data: d,
//           message: 'users/vehicle'
//         });
//       } else {
//         res.json({
//           status: 200,
//           message: 'users/vehicle/failed'
//         });
//       }
//     } else {
//       res.json({
//         status: 200,
//         message: 'users/vehicle/failed'
//       });
//     }
//   });
// });

// router.post('/vehiclelist', (req, res) => {
//   const decoded = jwt.verify(req.body.uuid, process.env.JWT_SECRET, {
//     ignoreExpiration: true
//   });

//   const sql = 'SELECT * FROM db_vehicle WHERE status=1';
//   db.query(sql, (e, d, _f) => {
//     if (!e) {
//       if (d && d.length > 0) {
//         res.json({
//           status: 200,
//           data: d,
//           message: 'users/vehicle'
//         });
//       } else {
//         res.json({
//           status: 200,
//           message: 'users/vehicle/failed'
//         });
//       }
//     } else {
//       res.json({
//         status: 200,
//         message: 'users/vehicle/failed'
//       });
//     }
//   });
// });

// module.exports = router;
