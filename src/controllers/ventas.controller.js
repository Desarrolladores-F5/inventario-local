const service = require("../services/ventas.service");
const response = require("../utils/response");

exports.registrarVenta = async (req, res) => {
  try {
    const venta = await service.registrarVenta(req.body);
    response.success(res, venta, "Venta registrada");
  } catch (err) {
    response.error(res, err.message, 400);
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const ventas = await service.listarVentas();
    response.success(res, ventas);
  } catch (err) {
    response.error(res, err.message);
  }
};
