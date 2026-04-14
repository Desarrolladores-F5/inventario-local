const express = require("express");
const router = express.Router();
const controller = require("../controllers/productos.controller");

// CREATE
router.post("/", controller.crearProducto);

// READ
router.get("/", controller.listarProductos);

// UPDATE (EDITAR)
router.put("/:id", controller.actualizarProducto);

// SOFT DELETE (RECOMENDADO)
router.put("/:id/desactivar", controller.desactivarProducto);

module.exports = router;