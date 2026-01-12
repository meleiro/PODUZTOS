const { PrismaClient, Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Pool de PG usando la misma DATABASE_URL
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Adapter que Prisma 7 necesita
const adapter = new PrismaPg(pgPool);

// Prisma Client
const prisma = new PrismaClient({ adapter });

/**
 * NOTA IMPORTANTE (adaptación a tu schema.prisma):
 * - Modelos: productos, productos_digitales
 * - Relación: productos.productos_digitales es un ARRAY (1-N).
 *   En tu UI solo se muestra un tamaño, así que tomamos el primero si existe.
 */

// -------------------------
// INSERTAR PRODUCTO FÍSICO
// -------------------------
async function insertarProducto(producto) {
  const { nombre, precio, stock } = producto;

  const creado = await prisma.productos.create({
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock: Number(stock),
      tipo: "FISICO",
    },
  });

  return {
    ...creado,
    precio: creado.precio.toString(),
    tamano_descarga_mb: null,
  };
}

// -------------------------
// INSERTAR PRODUCTO DIGITAL
// (inserta en productos + productos_digitales)
// -------------------------
async function insertarProductoDigital(productoDigital) {
  const { nombre, precio, stock, tamañoDescarga, tamanoDescarga } = productoDigital;

  const size = tamañoDescarga ?? tamanoDescarga;

  const creado = await prisma.productos.create({
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock: Number(stock),
      tipo: "DIGITAL",
      productos_digitales: {
        create: {
          tamano_descarga_mb: Number(size),
        },
      },
    },
    include: { productos_digitales: true },
  });

  const firstDigital = creado.productos_digitales?.[0];

  return {
    id: creado.id,
    nombre: creado.nombre,
    precio: creado.precio.toString(),
    stock: creado.stock,
    tipo: creado.tipo,
    tamano_descarga_mb: firstDigital ? firstDigital.tamano_descarga_mb : null,
  };
}

// -------------------------
// OBTENER TODOS
// -------------------------
async function obtenerTodos() {
  const items = await prisma.productos.findMany({
    include: { productos_digitales: true },
    orderBy: { id: "asc" },
  });

  return items.map((p) => {
    const firstDigital = p.productos_digitales?.[0];
    return {
      id: p.id,
      nombre: p.nombre,
      precio: p.precio.toString(),
      stock: p.stock,
      tipo: p.tipo,
      tamano_descarga_mb: firstDigital ? firstDigital.tamano_descarga_mb : null,
    };
  });
}

// -------------------------
// OBTENER POR ID
// -------------------------
async function obtenerPorId(id) {
  const p = await prisma.productos.findUnique({
    where: { id: Number(id) },
    include: { productos_digitales: true },
  });

  if (!p) return null;

  const firstDigital = p.productos_digitales?.[0];

  return {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio.toString(),
    stock: p.stock,
    tipo: p.tipo,
    tamano_descarga_mb: firstDigital ? firstDigital.tamano_descarga_mb : null,
  };
}

// -------------------------
// ACTUALIZAR PRODUCTO (común)
// -------------------------
async function actualizarProducto(id, datos) {
  const { nombre, precio, stock } = datos;

  const actualizado = await prisma.productos.update({
    where: { id: Number(id) },
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock: Number(stock),
    },
  });

  return {
    ...actualizado,
    precio: actualizado.precio.toString(),
  };
}

// -------------------------
// ACTUALIZAR TAMAÑO DIGITAL (por producto_id)
// -------------------------
async function actualizarTamanoDigital(idProducto, tamanoDescargaMb) {
  const digital = await prisma.productos_digitales.findFirst({
    where: { producto_id: Number(idProducto) },
    orderBy: { id: "asc" },
  });

  if (!digital) return null;

  return prisma.productos_digitales.update({
    where: { id: digital.id },
    data: { tamano_descarga_mb: Number(tamanoDescargaMb) },
  });
}

// -------------------------
// BORRAR PRODUCTO (Cascade borra digitales)
// -------------------------
async function borrarProducto(id) {
  await prisma.productos.delete({
    where: { id: Number(id) },
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
  cerrar,
};
