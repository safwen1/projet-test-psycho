const express = require("express");
const riasecRoutes = require('./riasecRoutes');
const bigFiveRoutes = require('./bigFiveRoutes');
const mwmsRoutes = require('./mwmsRoutes');
const router = express.Router();

router.use("/riasec", riasecRoutes);
router.use("/bigfive", bigFiveRoutes);
router.use("/mwms", mwmsRoutes);

module.exports = router;
