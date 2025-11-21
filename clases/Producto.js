class Producto {


    constructor(nombre, precio, stock) {

        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;

    }


   calcularIVA(porcentajeIva) {

        const iva = this.precio * porcentajeIva;
        return iva;
    }


    mostrarInfo(){

        console.log(`Nombre: ${this.nombre}`);
        console.log(`Precio: ${this.precio}`);
        console.log(`Stock: ${this.stock}`);
        console.log(`IVA (21%): ${this.calcularIVA(0.21)}€`);

    }


}

module.exports =  Producto;