const router = require('express').Router();

const { verifyAPIJWT } = require('../common/commonFunctions');
const { save } = require('../controllers/company.controller');

router.post('/save', verifyAPIJWT, save);

module.exports = router;
