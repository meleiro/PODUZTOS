// =========================
// Clase ProductoDigital
// =========================

// IMPORTAMOS la clase padre
const Producto = require("./Producto");

// Esta clase hereda de Producto y añade tamañoDescarga (en MB).
// Usamos "extends" para herencia y "super" para llamar al constructor padre.

class ProductoDigital extends Producto {

  constructor(nombre, precio, stock, tamañoDescarga) {
    super(nombre, precio, stock); // reutilizamos constructor de Producto
    this.tamañoDescarga = tamañoDescarga;
  }

  mostrarInfo() {
    // Sobrescribimos el método para incluir el nuevo dato
    super.mostrarInfo();
    console.log(`Tamaño descarga: ${this.tamañoDescarga} MB`);
    console.log("=====================");
  }
}

// Exportamos la clase
module.exports = ProductoDigital;
