// =========================
// Clase Producto
// =========================

// Producto genérico: nombre, precio, stock.
// Incluye cálculo de IVA y método mostrarInfo.
class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  calcularIVA() {
    const iva = this.precio * 0.21;
    return iva;
  }

  mostrarInfo() {
    console.log(`Producto: ${this.nombre}`);
    console.log(`Precio: ${this.precio}€`);
    console.log(`Stock: ${this.stock}`);
    console.log(`IVA (21%): ${this.calcularIVA()}€`);
    console.log("---------------------");
  }
}

module.exports = Producto;
