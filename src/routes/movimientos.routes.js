const express = require("express");
const router = express.Router();
const controller = require("../controllers/movimientos.controller");

router.get("/", controller.listarMovimientos);

module.exports = router;
