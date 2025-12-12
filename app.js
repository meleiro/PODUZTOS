const express = require("express");
const path = require("path");
const pDAO = require("./model/ProductosDAO");

const app = express();
const PORT = 3000;

// Motor de vistas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Para leer datos de formularios (POST)
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// ---------------------------
// RUTA: LISTAR PRODUCTOS
// ---------------------------
app.get("/productos", async (req, res) => {
  try {
    const productos = await pDAO.obtenerTodos();
    res.render("productos/lista", { productos });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

// ---------------------------
// INICIO SIMPLE
// ---------------------------
app.get("/", (req, res) => {
  res.redirect("/productos");
});

// ---------------------------
// LANZAR SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`Servidor web escuchando en http://localhost:${PORT}`);
});
