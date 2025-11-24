// =========================
// Clase ProductoDigital
// =========================

// IMPORTAMOS la clase padre

const Producto = require("./Producto");

// Esta clase hereda de Producto y añade tamañoDescarga (en MB).
// Usamos "extends" para herencia y "super" para llamar al constructor padre.

class ProductoDigital extends Producto {

    constructor(nombre, precio, stock, tamDescarga) {
        super(nombre, precio, stock);
        this.tamDescarga = tamDescarga;
    }


    mostrarInfo() {
        super.mostrarInfo();
        console.log(`Tamaño descarga: ${this.tamDescarga} MB`);
    }

}

module.exports = ProductoDigital;
