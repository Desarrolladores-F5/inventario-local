const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const productosRoutes = require("./routes/productos.routes");
const ventasRoutes = require("./routes/ventas.routes");
const movimientosRoutes = require("./routes/movimientos.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Crear tablas
db.run(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER,
    cantidad INTEGER,
    total REAL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER,
    tipo TEXT,
    cantidad INTEGER,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 🔥 USAR RUTAS MODULARES
app.use("/productos", productosRoutes);
app.use("/ventas", ventasRoutes);
app.use("/movimientos-stock", movimientosRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto 3000");
});
