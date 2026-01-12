/*****************************************************************************************
 * app.js (o server.js) — CRUD de productos con Express + EJS + DAO
 * ---------------------------------------------------------------------------------------
 * QUÉ HACE ESTE ARCHIVO
 * 1) Configura un servidor web con Express.
 * 2) Configura un motor de plantillas (EJS) y layouts (express-ejs-layouts).
 * 3) Define rutas (GET/POST) para listar, crear, editar y borrar productos.
 * 4) Delega el acceso a datos en un DAO (ProductosDAO).
 *
 * IDEA IMPORTANTE PARA ALUMNOS
 * - Este archivo NO debería “hablar” con la base de datos directamente.
 * - La lógica de datos vive en el DAO (pDAO), aquí solo gestionamos rutas y vistas.
 *****************************************************************************************/


/* =============================================================================
   1) IMPORTACIONES / DEPENDENCIAS
   ============================================================================= */

/**
 * Express: framework para crear servidores web en Node.js.
 * Proporciona:
 * - app.get/app.post para rutas
 * - middleware con app.use
 * - res.render / res.redirect / res.status / etc.
 */
const express = require("express");

/**
 * express-ejs-layouts: librería para usar una plantilla base (layout)
 * y “meter dentro” las vistas concretas.
 * Muy útil para no repetir header/footer en todas las páginas.
 */
const layouts = require("express-ejs-layouts");

/**
 * path: módulo nativo de Node para trabajar con rutas de archivos de forma segura
 * (funciona igual en Windows, Linux y Mac).
 */
const path = require("path");

/**
 * pDAO: nuestro “Data Access Object” (objeto de acceso a datos).
 * Se encarga de:
 * - obtenerTodos
 * - obtenerPorId
 * - insertarProducto
 * - actualizarProducto
 * - borrarProducto
 *
 * Aquí lo tratamos como “caja negra”.
 */
require("dotenv").config();
const repo = require("./model/ProductosRepo");


/* =============================================================================
   2) CREACIÓN DE LA APLICACIÓN Y CONFIGURACIÓN BÁSICA
   ============================================================================= */

/**
 * app: objeto principal de Express.
 * Sobre él:
 * - configuramos middlewares
 * - definimos rutas
 * - levantamos el servidor con listen()
 */
const app = express();

/**
 * PORT: puerto donde escuchará el servidor.
 * Si abres: http://localhost:3000
 * estarás entrando al servidor local.
 *
 * Alternativa habitual en proyectos reales:
 * const PORT = process.env.PORT || 3000;
 * (para poder usar el puerto que te dé el hosting)
 */
const PORT = 3000;


/* =============================================================================
   3) CONFIGURACIÓN DEL MOTOR DE VISTAS (EJS)
   ============================================================================= */

/**
 * app.set("view engine", "ejs")
 * ----------------------------
 * Indica a Express que vamos a renderizar vistas con EJS.
 * Esto permite usar:
 * res.render("rutaVista", datos)
 */
app.set("view engine", "ejs");

/**
 * app.set("views", ...)
 * ---------------------
 * Indica a Express dónde están las carpetas/archivos de vistas.
 * path.join(__dirname, "views") crea la ruta absoluta del directorio /views.
 *
 * __dirname = carpeta donde está este archivo.
 */
app.set("views", path.join(__dirname, "views"));


/* =============================================================================
   4) MIDDLEWARES (funciones que se ejecutan en cada petición)
   ============================================================================= */

/**
 * express.urlencoded({ extended: true })
 * -------------------------------------
 * Permite leer datos enviados por formularios HTML (POST).
 *
 * Cuando envías un formulario:
 * - el navegador manda nombre=...&precio=...&stock=...
 * Express lo “parsea” y lo deja en req.body.
 *
 * extended: true significa que puede interpretar estructuras más complejas
 * (por ejemplo arrays/objetos). Con formularios básicos casi no se nota.
 *
 * Alternativa:
 * - express.json() para APIs que envían JSON (Postman, fetch, etc.)
 */
app.use(express.urlencoded({ extended: true }));

/**
 * app.use(layouts)
 * ---------------
 * Activa el sistema de layouts de express-ejs-layouts.
 */
app.use(layouts);

/**
 * app.set("layout", "layout")
 * ---------------------------
 * Define el layout por defecto:
 * views/layout.ejs (normalmente)
 *
 * OJO: más abajo en una ruta cambias el layout a "layout-admin".
 */
app.set("layout", "layout");

/**
 * app.use(express.static("public"))
 * --------------------------------
 * Sirve archivos estáticos desde la carpeta /public:
 * - CSS
 * - imágenes
 * - JS del cliente
 *
 * Ejemplo:
 * public/styles.css -> accesible como /styles.css
 */
app.use(express.static("public"));


/* =============================================================================
   5) RUTAS (ENDPOINTS)
   =============================================================================
   Convención rápida:
   - GET  -> mostrar páginas o datos
   - POST -> enviar datos (crear/editar/borrar)
   ============================================================================= */


/* ---------------------------
   RUTA: LISTAR PRODUCTOS
   GET /productos
   ---------------------------
   - Consulta el DAO para obtener todos los productos.
   - Renderiza una vista EJS con esos datos.
*/
app.get("/productos", async (req, res) => {
  try {
    /**
     * await pDAO.obtenerTodos()
     * ------------------------
     * Llama al DAO y espera el resultado.
     * Como es async, podemos usar await.
     *
     * productos normalmente será un array:
     * [{id, nombre, precio, stock}, ...]
     */
    const productos = await repo.obtenerTodos();

    /**
     * res.render(vista, datos)
     * ------------------------
     * Renderiza la vista "views/productos/lista.ejs"
     * y le pasa variables para usar en el HTML:
     * - title
     * - productos
     *
     * Además, aquí cambias el layout para esta vista:
     * layout: "layout-admin"
     * (es útil si el listado se muestra en una sección “admin”)
     */
    res.render("productos/lista", {
      title: "Listado",
      productos,
    });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});


/* ---------------------------
   INICIO SIMPLE
   GET /
   ---------------------------
   Redirige a /productos para que la página principal sea el listado.
*/
app.get("/", (req, res) => {
  res.redirect("/productos");
});


/* ---------------------------
   FORMULARIO NUEVO PRODUCTO
   GET /productos/nuevo
   ---------------------------
   Muestra el formulario para crear un producto.
*/
app.get("/productos/nuevo", (req, res) => {
  /**
   * Renderiza "views/productos/nuevo.ejs"
   * Aquí NO pasas layout explícito, así que usará el layout por defecto (layout).
   */
  res.render("productos/nuevo", { title: "Nuevo producto" });
});


/* ---------------------------
   CREAR PRODUCTO
   POST /productos
   ---------------------------
   - Recibe datos del formulario en req.body.
   - Los convierte a Number para precio y stock (porque vienen como texto).
   - Inserta usando el DAO.
   - Redirige al listado.
*/
app.post("/productos", async (req, res) => {
  try {
    /**
     * req.body
     * --------
     * Contiene los campos del formulario (name="...").
     * Ejemplo:
     * req.body = { nombre: "Botón", precio: "1.5", stock: "20" }
     */
    const { nombre, precio, stock } = req.body;

    /**
     * Conversión a Number
     * -------------------
     * Los inputs HTML llegan como string.
     * Usamos Number(...) para convertirlos.
     *
     * Alternativas:
     * - parseInt(stock, 10) para enteros
     * - parseFloat(precio) para decimales
     *
     * OJO: si el usuario escribe algo no numérico, Number("abc") -> NaN
     * (podrías validar antes de guardar).
     */
    const producto = {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
    };

    /**
     * Insertamos con el DAO
     */
    await repo.insertarProducto(producto);

    /**
     * Redirigimos para volver al listado.
     * (Patrón PRG: Post/Redirect/Get para evitar reenvío al refrescar)
     */
    res.redirect("/productos");
  } catch (err) {
    console.error("error al crear producto: ", err);
    res.status(500).send("error al crear producto");
  }
});


/* ---------------------------
   FORMULARIO EDITAR PRODUCTO
   GET /productos/:id/editar
   ---------------------------
   - :id es un parámetro dinámico.
   - Busca el producto por id.
   - Si no existe -> 404.
   - Si existe -> renderiza la vista de edición.
*/
app.get("/productos/:id/editar", async (req, res) => {
  try {
    /**
     * req.params.id
     * -------------
     * Captura el valor de :id en la URL.
     * Ej: /productos/5/editar -> req.params.id = "5"
     */
    const id = Number(req.params.id);

    /**
     * Buscar el producto
     */
    const producto = await repo.obtenerPorId(id);

    /**
     * Si no existe, devolvemos 404.
     */
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    /**
     * Renderiza "views/productos/editar.ejs"
     * y envía el producto para rellenar el formulario.
     */
    res.render("productos/editar", {
      title: "Editar produto",
      producto,
    });
  } catch (err) {
    console.error("error al crear producto: ", err);
    res.status(500).send("error al crear producto");
  }
});


/* ---------------------------
   GUARDAR CAMBIOS DE EDICIÓN
   POST /productos/:id/editar
   ---------------------------
   - Lee id de la URL y campos del formulario.
   - Actualiza usando el DAO.
   - Redirige al listado.
*/
app.post("/productos/:id/editar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, stock } = req.body;

    /**
     * actualizarProducto(id, datos)
     * -----------------------------
     * El DAO decide cómo se actualiza (DB, fichero, memoria...).
     */
    await repo.actualizarProducto(id, {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
    });

    res.redirect("/productos");
  } catch (err) {
    console.error("error al crear producto: ", err);
    res.status(500).send("error al crear producto");
  }
});


/* ---------------------------
   BORRAR PRODUCTO
   POST /productos/:id/borrar
   ---------------------------
   - Lee id.
   - Llama al DAO para borrar.
   - Redirige al listado.
*/
app.post("/productos/:id/borrar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await repo.borrarProducto(id);
    res.redirect("/productos");
  } catch (err) {
    console.error("error al crear producto: ", err);
    res.status(500).send("error al crear producto");
  }
});


/* =============================================================================
   6) LANZAR SERVIDOR
   =============================================================================
   app.listen:
   - Arranca el servidor en el puerto indicado.
   - El callback se ejecuta cuando ya está escuchando.
*/
app.listen(PORT, () => {
  console.log(`Servidor web escuchando en http://localhost:${PORT}`);
});
