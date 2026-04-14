// =========================
// IMPORTACIÓN DB
// =========================
const db = require("../database/db");

// =========================
// LISTAR MOVIMIENTOS DE STOCK
// =========================
exports.listarMovimientos = () => {
  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT 
        m.id,
        p.nombre AS producto,
        m.tipo,
        m.cantidad,
        m.fecha
      FROM movimientos_stock m
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
      `,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );

  });
};
// =========================
// REGISTRAR VENTA (CON TRANSACCIÓN)
// =========================
exports.registrarVenta = ({ producto_id, cantidad }) => {
  return new Promise((resolve, reject) => {

    // Usamos serialize para asegurar orden de ejecución
    db.serialize(() => {

      // =========================
      // INICIO DE TRANSACCIÓN
      // =========================
      db.run("BEGIN TRANSACTION");

      // =========================
      // 1. OBTENER PRODUCTO
      // =========================
      db.get(
        "SELECT * FROM productos WHERE id = ?",
        [producto_id],
        (err, producto) => {

          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          // =========================
          // 2. VALIDACIONES
          // =========================
          if (!producto) {
            db.run("ROLLBACK");
            return reject(new Error("Producto no encontrado"));
          }

          if (producto.stock < cantidad) {
            db.run("ROLLBACK");
            return reject(new Error("Stock insuficiente"));
          }

          // =========================
          // 3. CÁLCULOS
          // =========================
          const total = producto.precio * cantidad;
          const nuevoStock = producto.stock - cantidad;

          // =========================
          // 4. ACTUALIZAR STOCK
          // =========================
          db.run(
            "UPDATE productos SET stock = ? WHERE id = ?",
            [nuevoStock, producto_id],
            (err) => {

              if (err) {
                db.run("ROLLBACK");
                return reject(err);
              }

              // =========================
              // 5. REGISTRAR VENTA
              // =========================
              db.run(
                "INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)",
                [producto_id, cantidad, total],
                function (err) {

                  if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                  }

                  const ventaId = this.lastID;

                      // =========================
                      // 6. REGISTRAR MOVIMIENTO DE STOCK (FORMATO PROFESIONAL)
                     // =========================
                      db.run(
                     "INSERT INTO movimientos_stock (producto_id, tipo, cantidad) VALUES (?, 'SALIDA', ?)",
                     [producto_id, cantidad],
                     (err) => {

                      // =========================
                      // 7. CONFIRMAR TRANSACCIÓN
                      // =========================
                      db.run("COMMIT");

                      // =========================
                      // 8. RESPUESTA FINAL
                      // =========================
                      resolve({
                        venta_id: ventaId,
                        producto: producto.nombre,
                        cantidad,
                        total,
                        stock_restante: nuevoStock
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};


// =========================
// LISTAR VENTAS
// =========================
exports.listarVentas = () => {
  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT 
        v.id, 
        p.nombre as producto, 
        v.cantidad, 
        v.total, 
        v.fecha
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      ORDER BY v.fecha DESC
      `,
      [],
      (err, rows) => {

        if (err) return reject(err);

        resolve(rows);
      }
    );

  });
};