const Producto = require("./Producto");

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
