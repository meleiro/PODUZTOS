// Importamos el pool de conexión a PostgreSQL desde db.js
// Este "pool" permite ejecutar consultas a la base de datos.
const pool = require("../db");

// Importamos las clases POO usadas en la aplicación.
// No se necesitan directamente dentro de esta función,
// pero normalmente se usan para crear o validar objetos antes de insertarlos.
const Producto = require("../clases/Producto");
const ProductoDigital = require("../clases/ProductoDigital");


// =======================================================
// FUNCIÓN: insertarProducto
// Inserta un producto FÍSICO en la base de datos PostgreSQL.
// Recibe un objeto Producto y lo guarda en la tabla "productos".
// =======================================================
async function insertarProducto(producto) {

    // Hacemos destructuring: extraemos los atributos del objeto
    // Ejemplo: producto = { nombre: "Libro", precio: 30, stock: 10 }
    const { nombre, precio, stock } = producto;
   
    // Ejecutamos una consulta SQL con parámetros seguros.
    // - pool.query ejecuta la consulta en PostgreSQL.
    // - Las variables $1, $2, $3 son parámetros para evitar inyección SQL.
    // - RETURNING * hace que PostgreSQL nos devuelva la fila insertada.
    const result = await pool.query(

        `INSERT INTO productos (nombre, precio, stock, tipo)
         VALUES ($1, $2, $3, 'FISICO')       
         RETURNING *`,                       

        // Valores que queremos insertar: los ponemos en el mismo orden que $1, $2, $3
        [nombre, precio, stock]
    );

    // result.rows es un array con las filas devueltas.
    // Como RETURNING devuelve una sola fila, accedemos a la primera: rows[0].
    return result.rows[0];
}

