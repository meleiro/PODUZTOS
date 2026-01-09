// Importamos la clase Pool desde la librería 'pg' (node-postgres).
// Pool permite gestionar un "grupo" de conexiones a PostgreSQL,
// lo cual mejora el rendimiento frente a abrir y cerrar conexiones manualmente.
const { Pool } = require("pg");


// Creamos una instancia del Pool.
// Esta será la conexión reutilizable que usará toda la app para consultar la BD.
const pool = new Pool({

    // Usuario con el que nos conectamos a PostgreSQL.
    user: "postgres",

    // Dirección del servidor donde está PostgreSQL.
    // Si la BD está en el mismo equipo → localhost.
    host: "localhost",

    // Nombre de la base de datos a la que queremos conectarnos.
    database: "productos",

    // Contraseña del usuario.
    password: "adminPopo4.",

    // Puerto donde escucha PostgreSQL (por defecto: 5432).
    port: 5432
});

const DATABASE_URL = "postgresql://postgres:adminPopo4.@localhost:5432/productos"


// Exportamos el pool para que otros archivos (index.js, repositorios, etc.)
// puedan usarlo simplemente con: const pool = require("./db");
module.exports = pool;
