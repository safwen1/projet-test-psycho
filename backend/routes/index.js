const express = require("express");
const ambiRoutes = require('./ambiRoutes');
const gcbsRoutes = require('./gcbsRoutes');
const riasecRoutes = require('./riasecRoutes');
const bigFiveRoutes = require('./bigFiveRoutes');
const router = express.Router();

router.use("/ambi", ambiRoutes);
router.use("/gcbs", gcbsRoutes);
router.use("/riasec", riasecRoutes);
router.use("/bigfive", bigFiveRoutes);

module.exports = router;
