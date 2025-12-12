// Importamos el pool de conexión a PostgreSQL desde db.js.
// Este "pool" es un objeto que gestiona un conjunto de conexiones a la base de datos.
// Permite ejecutar consultas con pool.query(...) sin tener que abrir/cerrar conexiones a mano.
const pool = require("../db/db");

// Importamos las clases POO usadas en la aplicación.
// Normalmente se usan para crear objetos Producto / ProductoDigital antes de guardarlos,
// validar sus datos, aplicar métodos, etc.
const Producto = require("../clases/Producto");
const ProductoDigital = require("../clases/ProductoDigital");


// =======================================================
// FUNCIÓN: insertarProducto
// Inserta un producto FÍSICO en la base de datos PostgreSQL.
// Recibe un objeto Producto (o algo con misma estructura) y lo guarda
// en la tabla "productos" con tipo = 'FISICO'.
// =======================================================
async function insertarProducto(producto) {

    // Hacemos destructuring del objeto recibido:
    // Extraemos nombre, precio y stock de "producto".
    // Ejemplo: producto = { nombre: "Libro", precio: 30, stock: 10 }
    const { nombre, precio, stock } = producto;
   
    // Ejecutamos una consulta SQL con parámetros.
    // - pool.query ejecuta la consulta sobre la BD.
    // - Usamos $1, $2, $3 como placeholders para los valores reales,
    //   para evitar inyección SQL.
    // - RETURNING * hace que PostgreSQL devuelva la fila insertada.
    const result = await pool.query(

        `INSERT INTO productos (nombre, precio, stock, tipo)
         VALUES ($1, $2, $3, 'FISICO')       
         RETURNING *`,                       

        // Array con los valores que sustituyen a $1, $2, $3 en orden.
        [nombre, precio, stock]
    );

    // result.rows es un array con las filas devueltas por la consulta.
    // Como la inserción es de un único registro, habrá una sola fila.
    // Devolvemos la fila insertada: la primera posición del array.
    return result.rows[0];
}


// =======================================================
// FUNCIÓN: insertarProductoDigital
// Inserta un producto DIGITAL en la base de datos PostgreSQL.
// - Inserta primero en la tabla "productos" con tipo = 'DIGITAL'.
// - Después inserta los datos específicos del producto digital
//   en la tabla "productos_digitales" (tamaño de descarga, etc.).
// =======================================================
async function insertarProductoDigital(ProductoDigital) {

    // Destructuring del objeto que nos llega (mal nombrado con mayúscula, ver notas).
    // Se espera que el objeto tenga estas propiedades:
    // { nombre, precio, stock, tamañoDescarga }
    const { nombre, precio, stock, tamañoDescarga } = ProductoDigital;
    
    // 1) Insertamos en la tabla general de productos como tipo 'DIGITAL'.
    const resultProd = await pool.query(

        `INSERT INTO productos (nombre, precio, stock, tipo)
         VALUES ($1, $2, $3, 'DIGITAL')       
         RETURNING *`,                       

        [nombre, precio, stock]
    );

    // Tomamos el id del producto recién insertado.
    // resultProd.rows[0] es el producto que acaba de entrar en la tabla "productos".
    const productoId = resultProd.rows[0].id;

    // 2) Insertamos en la tabla específica de productos digitales,
    // vinculándolo al id del producto general.
    const resultProdDigital = await pool.query(

        `INSERT INTO productos_digitales (producto_id, tamano_descarga_mb)
         VALUES ($1, $2)       
         RETURNING *`,                       

        // $1 = productoId, $2 = tamaño de descarga en MB.
        [productoId, tamañoDescarga]
    );

    // Devolvemos un objeto que combine:
    // - Los datos del producto "general" (tabla productos).
    // - El tamaño de descarga específico del digital.
    return {
        // OJO: aquí debería ser resultProd.rows[0], ver notas de error.
        ...resultProd[0], 
        tamano_descarga_mb: resultProdDigital.rows[0].tamano_descarga_mb
    };
}


// =======================================================
// FUNCIÓN: obtenerTodos
// Devuelve todos los productos (físicos y digitales) con JOIN a su tabla digital.
// - Selecciona de "productos".
// - LEFT JOIN con "productos_digitales" para añadir tamano_descarga_mb
//   cuando exista (productos digitales).
// =======================================================
async function obtenerTodos() {

    // Hacemos una consulta que devuelve todos los productos.
    // LEFT JOIN significa:
    //   - Devuelve todos los productos de "productos" (p).
    //   - Si existe un registro correspondiente en productos_digitales (d),
    //     añade sus datos; si no, d.* será null.
    const result = await pool.query(
        `SELECT p.id, p.nombre, p.precio, p.stock, p.tipo,
                d.tamano_descarga_mb
         FROM productos p
         LEFT JOIN productos_digitales d ON d.producto_id = p.id
         ORDER BY p.id`
    );

    // Devolvemos solo las filas resultantes (array de objetos).
    return result.rows;
}


// Exportamos las funciones que queremos usar desde otros archivos.
// (Ahora mismo se exportan solo insertarProducto y insertarProductoDigital;
// obtenerTodos existe pero no se está exportando, ver notas.)
module.exports = {
    insertarProducto,
    insertarProductoDigital,
    obtenerTodos
};
