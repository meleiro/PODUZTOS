const Producto = require("./clases/Producto");
const ProductoDigital = require("./clases/ProductoDigital");
const pDAO = require("./model/ProductosDAO")

async function main() {


    try {

        const libro = new Producto("Andrea Valenti", 30, 20);
        const ebook = new ProductoDigital("Andrea Valenti", 10, 999, 120);


        console.log("Libro:", libro);
        console.log("Libro Digital:", ebook);

        const libroDB = await pDAO.insertarProducto(libro);
        console.log("Libro insertado: ", libroDB);
        const ebookDB = await pDAO.insertarProductoDigital(ebook);
        console.log("Libro digital insertado: ", ebookDB);

    } catch (err) {
        console.error("Error al conectar con la BBDD", err);
    }



}

main();