/* ============================
   SELECCIÓN DINÁMICA DE CAPA DE DATOS
   ============================ */
const useORM = (process.env.DATA_LAYER || "").trim().toUpperCase === "ORM";

console.log("ENV_DATA_LAYER =",process.env.DATA_LAYER );

const proveedor = useORM ? require("./ProductosORM") : require("./ProductosDAO");


module.exports = {

  insertarProducto: (producto) => proveedor.insertarProducto(producto),
  insertarProductoDigital: (productoDigital) =>  proveedor.insertarProductoDigital(productoDigital),
  obtenerTodos: () => proveedor.obtenerTodos(),
  obtenerPorId: (id) => proveedor.obtenerPorId(id),
  actualizarProducto: (id, datos) => proveedor.actualizarProducto(id, datos),
  actualizarTamanoDigital: (id, tamanoMb) => proveedor.actualizarTamanoDigital(id, tamanoMb),
  borrarProducto: (id) => proveedor.borrarProducto(id),
  cerrar: () => proveedor.cerrar(),

};

