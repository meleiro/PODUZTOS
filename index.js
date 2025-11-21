const Producto = require("./clases/Producto");
const ProductoDigital = require("./clases/ProductoDigital");

const fs = require("fs/promises");
const fsCb = require("fs");

const DATA_DIR = "./data";
const DATA_FILE = `${DATA_DIR}/productos.json`;
const LOG_FILE = `${DATA_DIR}/log.txt`;


const libro = new Producto ("Libro 2019", 30, 12);
const ebook = new ProductoDigital("Libro 2019", 30, 12, 45.12);

const productos = [libro, ebook];

const productosJSON = JSON.stringify(productos, null, 2);
console.log("=====JSON GENERADO=====");
console.log(productosJSON);


libro.mostrarInfo();
ebook.mostrarInfo();

async function trabajoConFicheros() {

    try{
    //crear una carpeta data
       await fs.mkdir(DATA_DIR,{ recursive:true });
       console.log(`Carpeta ${DATA_DIR} lista`);


    //escribir en la carpeta el fichero json




    //leer fichero json


    //JSON.parse()


    //borrar ficheros

    }catch (error){
        console.error("Error trabajandon con ficheros", error);
    }

}
