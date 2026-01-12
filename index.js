// ==========================================================
// index.js — Pruebas de conexión y CRUD con PostgreSQL
// ==========================================================

const Producto = require("./clases/Producto");
const ProductoDigital = require("./clases/ProductoDigital");
const repo = require("./model/ProductosDAO");

async function main() {
  try {
    console.log("🚀 Iniciando pruebas con PostgreSQL...\n");

    // 1. Crear instancias (POO)
    const libro = new Producto("Libro Sagrado Valenti", 30, 20);
    const meditacion = new ProductoDigital("Meditación Supra", 15, 999, 120);

    console.log("📘 Producto físico creado (POO):", libro);
    console.log("💠 Producto digital creado (POO):", meditacion);

    // 2. Insertar
    const libroDB = await repo.insertarProducto(libro);
    console.log("\n📥 Producto físico insertado en la BD:");
    console.log(libroDB);

    const medDigitalDB = await repo.insertarProductoDigital(meditacion);
    console.log("\n📥 Producto digital insertado en la BD:");
    console.log(medDigitalDB);

    // 3. Leer todos
    console.log("\n📄 Listado completo de productos:");
    const todos = await repo.obtenerTodos();
    console.table(todos);

    // 4. Leer uno por id
    console.log("\n🔍 Consultando el producto con id =", libroDB.id);
    const uno = await repo.obtenerPorId(libroDB.id);
    console.log(uno);

    // 5. Actualizar producto físico
    console.log("\n✏️ Actualizando el libro...");
    const actualizado = await repo.actualizarProducto(libroDB.id, {
      nombre: "Libro Sagrado Valenti — Edición Dorada",
      precio: 40,
      stock: 10
    });
    console.log("📘 Producto actualizado:");
    console.log(actualizado);

    // 6. Actualizar digital
    console.log("\n✏️ Actualizando tamaño de descarga...");
    const actualizadoDig = await repo.actualizarTamanoDigital(
      medDigitalDB.id,
      150
    );
    console.log("💠 Tamaño de descarga actualizado:");
    console.log(actualizadoDig);

    // 7. Borrar un producto
    console.log(`\n🗑 Borrando producto digital con id ${medDigitalDB.id}...`);
    await repo.borrarProducto(medDigitalDB.id);
    console.log("✔ Producto digital eliminado (cascade).");

    // 8. Listado final
    console.log("\n📄 Listado final tras borrar:");
    const finales = await repo.obtenerTodos();
    console.table(finales);

    console.log("\n🎉 Pruebas completadas con éxito.");
  } catch (err) {
    console.error("❌ Error en las pruebas:", err);
  }
}

main();
