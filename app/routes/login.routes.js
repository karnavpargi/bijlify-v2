const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { verifyAPIJWT } = require('../common/commonFunctions');
const { sendOtp, verifyOtp, verify } = require('../controllers/login.controller');

// single request per 20 seconds.
const limiter = rateLimit({ windowMs: 20 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

router.get('/users/verify', verify);
router.get('/sendOtp/:mobile', limiter, sendOtp);
router.post('/verifyOtp', verifyAPIJWT, limiter, verifyOtp);

module.exports = router;
