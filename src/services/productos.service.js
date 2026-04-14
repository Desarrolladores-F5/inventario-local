const db = require("../database/db");

// ======================
// CREAR PRODUCTO
// ======================
exports.crearProducto = ({ nombre, precio, stock }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO productos (nombre, precio, stock, activo)
       VALUES (?, ?, ?, 1)`,
      [nombre, precio, stock],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID,
          nombre,
          precio,
          stock,
          activo: 1
        });
      }
    );
  });
};

// ======================
// LISTAR PRODUCTOS (SOLO ACTIVOS)
// ======================
exports.listarProductos = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM productos WHERE activo = 1`,
      [],
      (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      }
    );
  });
};

// ======================
// ACTUALIZAR PRODUCTO
// ======================
exports.actualizarProducto = (id, { nombre, precio, stock }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE productos
       SET nombre = ?, precio = ?, stock = ?
       WHERE id = ?`,
      [nombre, precio, stock, id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id,
          nombre,
          precio,
          stock
        });
      }
    );
  });
};

// ======================
// SOFT DELETE (DESACTIVAR)
// ======================
exports.desactivarProducto = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE productos SET activo = 0 WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id,
          activo: 0
        });
      }
    );
  });
};