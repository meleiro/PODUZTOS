const { PrismaClient, Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Pool de PG usando la misma DATABASE_URL
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Adapter que Prisma 7 necesita
const adapter = new PrismaPg(pgPool);

// Prisma Client ya “válido” en Prisma 7
const prisma = new PrismaClient({ adapter });


// -------------------------
// INSERTAR PRODUCTO FÍSICO
// -------------------------
async function insertarProducto(producto) {
  const { nombre, precio, stock } = producto;

  const creado = await prisma.producto.create({
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock,
      tipo: "FISICO"
    }
  });

  // Para que se parezca a pg: precio como string
  return {
    ...creado,
    precio: creado.precio.toString(),
    tamano_descarga_mb: null
  };
}

// -------------------------
// INSERTAR PRODUCTO DIGITAL
// (inserta en dos tablas vía relación)
// -------------------------
async function insertarProductoDigital(productoDigital) {
  const { nombre, precio, stock, tamañoDescarga, tamanoDescarga } = productoDigital;

  // Aceptamos ambos nombres por si el formulario manda tamanoDescarga
  const size = tamañoDescarga ?? tamanoDescarga;

  const creado = await prisma.producto.create({
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock,
      tipo: "DIGITAL",
      digital: {
        create: {
          tamanoDescargaMb: Number(size)
        }
      }
    },
    include: { digital: true }
  });

  return {
    id: creado.id,
    nombre: creado.nombre,
    precio: creado.precio.toString(),
    stock: creado.stock,
    tipo: creado.tipo,
    tamano_descarga_mb: creado.digital?.tamanoDescargaMb ?? null
  };
}

// -------------------------
// OBTENER TODOS
// (devuelve como tu SELECT con LEFT JOIN)
// -------------------------
async function obtenerTodos() {
  const items = await prisma.producto.findMany({
    include: { digital: true },
    orderBy: { id: "asc" }
  });

  return items.map(p => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio.toString(),
    stock: p.stock,
    tipo: p.tipo,
    tamano_descarga_mb: p.digital ? p.digital.tamanoDescargaMb : null
  }));
}

// -------------------------
// OBTENER POR ID
// -------------------------
async function obtenerPorId(id) {
  const p = await prisma.producto.findUnique({
    where: { id: Number(id) },
    include: { digital: true }
  });

  if (!p) return null;

  return {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio.toString(),
    stock: p.stock,
    tipo: p.tipo,
    tamano_descarga_mb: p.digital ? p.digital.tamanoDescargaMb : null
  };
}

// -------------------------
// ACTUALIZAR PRODUCTO (campos comunes)
// -------------------------
async function actualizarProducto(id, datos) {
  const { nombre, precio, stock } = datos;

  const actualizado = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock: Number(stock)
    }
  });

  return {
    ...actualizado,
    precio: actualizado.precio.toString()
  };
}

// -------------------------
// ACTUALIZAR TAMAÑO DIGITAL
// -------------------------
async function actualizarTamanoDigital(idProducto, tamanoDescargaMb) {
  const actualizado = await prisma.productoDigital.update({
    where: { productoId: Number(idProducto) },
    data: { tamanoDescargaMb: Number(tamanoDescargaMb) }
  });

  // Tu DAO devuelve la fila de productos_digitales
  return actualizado;
}

// -------------------------
// BORRAR PRODUCTO
// (Cascade borra el digital si existe)
// -------------------------
async function borrarProducto(id) {
  await prisma.producto.delete({
    where: { id: Number(id) }
  });
}

// -------------------------
// Cerrar prisma (para SIGINT)
// -------------------------
async function cerrar() {
  await prisma.$disconnect();
}

module.exports = {
  insertarProducto,
  insertarProductoDigital,
  obtenerTodos,
  obtenerPorId,
  actualizarProducto,
  actualizarTamanoDigital,
  borrarProducto,
  cerrar
};
