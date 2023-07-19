const express = require("express");
const { initializeDb, statistics, barChart, pieChart, combined } = require("../controllers/itemController");
const router = express.Router();


router.route("/items").get(initializeDb);
router.route("/items/statistics").get(statistics);
router.route("/items/barchart").get(barChart);
router.route("/items/piechart").get(pieChart);
router.route("/items/combined").get(combined);



module.exports = router;