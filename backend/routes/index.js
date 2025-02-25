const express = require("express");
const riasecRoutes = require('./riasecRoutes');
const bigFiveRoutes = require('./bigFiveRoutes');
const router = express.Router();

router.use("/riasec", riasecRoutes);
router.use("/bigfive", bigFiveRoutes);

module.exports = router;
