const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/inventario.db", (err) => {
  if (err) {
    console.error("Error al conectar DB:", err.message);
  } else {
    console.log("Base de datos conectada");
  }
});

module.exports = db;
