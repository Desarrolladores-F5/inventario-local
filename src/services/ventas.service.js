const db = require("../database/db");

exports.registrarVenta = ({ producto_id, cantidad }) => {
  return new Promise((resolve, reject) => {

    db.get("SELECT * FROM productos WHERE id = ?", [producto_id], (err, producto) => {
      if (err) return reject(err);

      if (!producto) {
        return reject(new Error("Producto no encontrado"));
      }

      if (producto.stock < cantidad) {
        return reject(new Error("Stock insuficiente"));
      }

      const total = producto.precio * cantidad;
      const nuevoStock = producto.stock - cantidad;

      db.run(
        "UPDATE productos SET stock = ? WHERE id = ?",
        [nuevoStock, producto_id],
        (err) => {
          if (err) return reject(err);

          db.run(
            "INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)",
            [producto_id, cantidad, total],
            function (err) {
              if (err) return reject(err);

              // Movimiento
              db.run(
                "INSERT INTO movimientos_stock (producto_id, tipo, cantidad) VALUES (?, 'VENTA', ?)",
                [producto_id, -cantidad]
              );

              resolve({
                venta_id: this.lastID,
                producto: producto.nombre,
                cantidad,
                total,
                stock_restante: nuevoStock
              });
            }
          );
        }
      );
    });
  });
};

exports.listarVentas = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT v.id, p.nombre as producto, v.cantidad, v.total, v.fecha
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      ORDER BY v.fecha DESC
    `, [], (err, rows) => {
      if (err) return reject(err);

      resolve(rows);
    });
  });
};
