const { PrismaClient, Prisma } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

/* ============================
   CONEXIÓN A POSTGRES + PRISMA
   ============================ */

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pgPool);
const prisma = new PrismaClient({ adapter });

/* ============================
   HELPERS DE FORMATEO
   ============================ */

/**
 * Convierte un registro de "productos" (con include de productos_digitales)
 * a un objeto listo para JSON (Decimal -> string).
 */
function normalizarProducto(p) {
  const primerDigital = (p.productos_digitales && p.productos_digitales.length > 0)
    ? p.productos_digitales[0]
    : null;

  return {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio.toString(), // Decimal => string para JSON
    stock: p.stock,
    tipo: p.tipo,
    tamano_descarga_mb: primerDigital ? primerDigital.tamano_descarga_mb : null,
  };
}

/* ============================
   OBTENER TODOS
   ============================ */

async function obtenerTodos() {
  const items = await prisma.productos.findMany({
    include: { productos_digitales: true }, // relación real del schema
    orderBy: { id: "asc" },
  });

  return items.map(normalizarProducto);
}

/* ============================
   OBTENER POR ID
   ============================ */

async function obtenerPorId(id) {
  const p = await prisma.productos.findUnique({
    where: { id: Number(id) },
    include: { productos_digitales: true },
  });

  if (!p) return null;

  return normalizarProducto(p);
}

/* ============================
   ACTUALIZAR PRODUCTO (BÁSICO)
   ============================ */

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

/* ============================
   ACTUALIZAR PRODUCTO DIGITAL
   ============================ */

/**
 * Actualiza el tamaño de descarga para el/los registros digitales
 * asociados a un producto (por producto_id).
 *
 */
async function actualizarProductoDigitalPorProductoId(productoId, tamanoDescarga) {
  const resultado = await prisma.productos_digitales.updateMany({
    where: { producto_id: Number(productoId) },
    data: { tamano_descarga_mb: Number(tamanoDescarga) },
  });

  // resultado = { count: X } indicando cuántas filas modificó
  return resultado;
}

/* ============================
   BORRAR PRODUCTO
   ============================ */

/**
 * Gracias a onDelete: Cascade en la relación,
 * al borrar un producto se borran también sus productos_digitales.
 */
async function borrarProducto(id) {
  await prisma.productos.delete({
    where: { id: Number(id) },
  });
}

/* ============================
   INSERTAR PRODUCTO FÍSICO
   ============================ */

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
  };
}

/* ============================
   INSERTAR PRODUCTO DIGITAL
   ============================ */

/**
 * Crea un producto y, además, un registro en productos_digitales
 * a través de la relación (array) productos_digitales[].
 */
async function insertarProductoDigital(productoDigital) {
  const { nombre, precio, stock, tamanoDescarga } = productoDigital;

  const creado = await prisma.productos.create({
    data: {
      nombre,
      precio: new Prisma.Decimal(precio),
      stock: Number(stock),
      tipo: "DIGITAL",

     
      productos_digitales: {
        create: [
          {
            tamano_descarga_mb: Number(tamanoDescarga),
          },
        ],
      },
    },
    include: { productos_digitales: true },
  });

  return normalizarProducto(creado);
}
