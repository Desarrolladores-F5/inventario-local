// =========================
// IMPORTACIÓN DB
// =========================
const db = require("../database/db");


// =========================
// LISTAR MOVIMIENTOS (CON FILTROS)
// =========================
exports.listarMovimientos = (filtros) => {
  return new Promise((resolve, reject) => {

    let query = `
      SELECT 
        m.id,
        p.nombre AS producto,
        m.tipo,
        m.cantidad,
        m.fecha
      FROM movimientos_stock m
      JOIN productos p ON m.producto_id = p.id
    `;

    const params = [];
    const conditions = [];

    // =========================
    // FILTRO POR PRODUCTO
    // =========================
    if (filtros.producto_id) {
      conditions.push("m.producto_id = ?");
      params.push(filtros.producto_id);
    }

    // =========================
    // FILTRO POR TIPO
    // =========================
    if (filtros.tipo) {
      conditions.push("m.tipo = ?");
      params.push(filtros.tipo);
    }

    // =========================
    // APLICAR CONDICIONES
    // =========================
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY m.fecha DESC";

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });

  });
};