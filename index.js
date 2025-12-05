// Importamos la clase Producto desde la carpeta ./clases.
// Esta clase representa un producto "físico" con sus atributos (nombre, precio, stock, etc.).
const Producto = require("./clases/Producto");

// Importamos la clase ProductoDigital, que extiende o complementa a Producto
// añadiendo información específica de productos digitales (por ejemplo, tamaño de descarga).
const ProductoDigital = require("./clases/ProductoDigital");

// Importamos el DAO (Data Access Object) que se encarga de hablar con la base de datos.
// pDAO expone funciones como insertarProducto, insertarProductoDigital, etc.
const pDAO = require("./model/ProductosDAO")


// Función principal de la aplicación.
// La marcamos como async porque dentro vamos a usar 'await' al llamar al DAO.
async function main() {

    try {
        // Creamos una instancia de Producto (producto físico).
        // Parámetros típicos: nombre, precio, stock (depende de cómo esté definida la clase).
        // En este ejemplo:
        // - nombre: "Andrea Valenti"
        // - precio: 30
        // - stock: 20
        const libro = new Producto("Andrea Valenti", 30, 20);

        // Creamos una instancia de ProductoDigital.
        // Parámetros posibles: nombre, precio, stock, tamañoDescarga (por ejemplo).
        // Aquí:
        // - nombre: "Andrea Valenti"
        // - precio: 10
        // - stock: 999
        // - tamaño de descarga: 120 (por ejemplo, MB)
        const ebook = new ProductoDigital("Andrea Valenti", 10, 999, 120);

        // Mostramos por consola los objetos creados en memoria,
        // antes de insertarlos en la base de datos.
        console.log("Libro:", libro);
        console.log("Libro Digital:", ebook);

        // Insertamos el producto físico en la base de datos usando el DAO.
        // insertarProducto devuelve (normalmente) el registro insertado en la tabla "productos".
        const libroDB = await pDAO.insertarProducto(libro);
        console.log("Libro insertado: ", libroDB);

        // Insertamos el producto digital en la base de datos.
        // insertarProductoDigital suele hacer dos inserciones:
        // - en "productos" (tipo DIGITAL)
        // - en "productos_digitales" con los datos específicos.
        const ebookDB = await pDAO.insertarProductoDigital(ebook);
        console.log("Libro digital insertado: ", ebookDB);

    } catch (err) {
        // Si ocurre cualquier error durante la creación de productos o las inserciones en BBDD,
        // entramos aquí. Mostramos un mensaje de error junto con el objeto de error.
        console.error("Error al conectar con la BBDD", err);
    }

}

// Llamamos a la función principal para arrancar el flujo.
// main() devuelve una Promesa, pero aquí no la estamos esperando con await
// ni encadenando un .catch(), porque ya manejamos errores dentro de main().
main();
