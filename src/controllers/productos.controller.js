const service = require("../services/productos.service");
const response = require("../utils/response");

// ======================
// CREAR PRODUCTO
// ======================
exports.crearProducto = async (req, res) => {
  try {
    const producto = await service.crearProducto(req.body);
    response.success(res, producto, "Producto creado");
  } catch (err) {
    response.error(res, err.message);
  }
};

// ======================
// LISTAR PRODUCTOS
// ======================
exports.listarProductos = async (req, res) => {
  try {
    const productos = await service.listarProductos();
    response.success(res, productos);
  } catch (err) {
    response.error(res, err.message);
  }
};

// ======================
// ACTUALIZAR PRODUCTO (EDITAR)
// ======================
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await service.actualizarProducto(id, req.body);

    response.success(res, producto, "Producto actualizado");
  } catch (err) {
    response.error(res, err.message);
  }
};

// ======================
// DESACTIVAR PRODUCTO (SOFT DELETE)
// ======================
exports.desactivarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await service.desactivarProducto(id);

    response.success(res, producto, "Producto desactivado");
  } catch (err) {
    response.error(res, err.message);
  }
};