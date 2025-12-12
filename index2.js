// =========================
// Index: POO + JSON + FS
// =========================

// Importamos clases
const Producto = require("./clases/Producto");
const ProductoDigital = require("./clases/ProductoDigital");

// Importamos FS con PROMESAS
const fs = require("fs/promises");
// Y FS clásico para callbacks (solo para el ejemplo de appendFile)
const fsCb = require("fs");

// Ruta del directorio y del fichero de datos
const DATA_DIR = "./data";
const DATA_FILE = `${DATA_DIR}/productos.json`;
const LOG_FILE = `${DATA_DIR}/log.txt`;

// -------------------------
// 1. Crear instancias (POO)
// -------------------------

const libro = new Producto("Libro de JavaScript", 30, 12);
const ebook = new ProductoDigital("Ebook Node.js", 15, 999, 45);

// Mostrar por consola (POO pura)
libro.mostrarInfo();
ebook.mostrarInfo();

// -------------------------
// 2. JSON: objeto → texto
// -------------------------

// Creamos un array de productos (estructura clave-valor)
const productos = [libro, ebook];

// JSON.stringify(): convierte OBJETO/ARRAY → TEXTO JSON
// - 2º parámetro = replacer (null → no filtramos nada)
// - 3º parámetro = número de espacios para que quede "bonito"
const productosJSON = JSON.stringify(productos, null, 2);

console.log("=== Texto JSON generado ===");
console.log(productosJSON);

// -------------------------
// 3. Funciones async con FS
//    (readFile, writeFile, mkdir, unlink)
// -------------------------

// Usamos una función async para poder usar await
async function trabajarConFicheros() {
  try {
    // 3.1 mkdir: crear carpeta "data" si no existe
    // { recursive: true } → no da error si ya existe
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log(`Carpeta ${DATA_DIR} lista.`);

    // 3.2 writeFile: escribir el JSON en un fichero
    await fs.writeFile(DATA_FILE, productosJSON, "utf-8");
    console.log(`Fichero ${DATA_FILE} guardado.`);

    // 3.3 readFile: leer el contenido del fichero
    const contenido = await fs.readFile(DATA_FILE, "utf-8");
    console.log("=== Contenido leído desde el fichero ===");
    console.log(contenido);

    // 3.4 JSON.parse(): TEXTO → OBJETO/ARRAY
    const productosLeidos = JSON.parse(contenido);
    console.log("=== Objetos reconstruidos desde JSON ===");
    console.log(productosLeidos);

    // 3.5 unlink (opcional): ejemplo de borrar un fichero temporal
    const TEMP_FILE = `${DATA_DIR}/temp.txt`;
    await fs.writeFile(TEMP_FILE, "Fichero temporal", "utf-8");
    console.log(`Fichero temporal creado: ${TEMP_FILE}`);

    await fs.unlink(TEMP_FILE);
    console.log(`Fichero temporal eliminado con unlink().`);

  } catch (error) {
    console.error("Error trabajando con ficheros:", error);
  }
}



// Llamamos a la función async
trabajarConFicheros();
