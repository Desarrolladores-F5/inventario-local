const db = require("../database/db");
const response = require("../utils/response");

exports.listarMovimientos = (req, res) => {
  db.all(`
    SELECT m.id, p.nombre as producto, m.tipo, m.cantidad, m.fecha
    FROM movimientos_stock m
    JOIN productos p ON m.producto_id = p.id
    ORDER BY m.fecha DESC
  `, [], (err, rows) => {
    if (err) return response.error(res, err.message);

    response.success(res, rows);
  });
};
