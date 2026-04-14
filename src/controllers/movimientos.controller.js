const service = require("../services/movimientos.service");
const response = require("../utils/response");


// =========================
// LISTAR MOVIMIENTOS (CON QUERY PARAMS)
// =========================
exports.listarMovimientos = async (req, res) => {
  try {
    const filtros = {
      producto_id: req.query.producto_id,
      tipo: req.query.tipo
    };

    const movimientos = await service.listarMovimientos(filtros);
    response.success(res, movimientos);

  } catch (err) {
    response.error(res, err.message);
  }
};