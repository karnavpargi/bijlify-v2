const router = require('express').Router();

const { verifyAPIJWT } = require('../common/commonFunctions');
const { save, list } = require('../controllers/vehicle.controller');

router.post('/save', verifyAPIJWT, save);
router.post('/list', verifyAPIJWT, list);

module.exports = router;
