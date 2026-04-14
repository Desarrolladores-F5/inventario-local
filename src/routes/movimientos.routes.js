const express = require("express");
const router = express.Router();
const controller = require("../controllers/movimientos.controller");

// =========================
// RUTA GET MOVIMIENTOS
// =========================
router.get("/", controller.listarMovimientos);

module.exports = router;