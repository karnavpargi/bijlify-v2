const router = require('express').Router();

const charger = require('./charger.routes');
const station = require('./station.routes');
const company = require('./company.routes');
const login = require('./login.routes');
const vehicle = require('./vehicle.routes');
const manufacturer = require('./manufacturer.routes');

router.use('/charger', charger);
router.use('/station', station);
router.use('/company', company);
router.use('/vehicle', vehicle);
router.use('/manufacturer', manufacturer);
router.use(login);

module.exports = router;
