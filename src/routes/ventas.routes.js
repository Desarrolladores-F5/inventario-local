const express = require("express");
const router = express.Router();
const controller = require("../controllers/ventas.controller");

router.post("/", controller.registrarVenta);
router.get("/", controller.listarVentas);

module.exports = router;
