/* ============================
   SELECCIÓN DINÁMICA DE CAPA DE DATOS
   ============================ */

/*
   Se obtiene el modo de acceso a datos desde una variable de entorno.
   - DATA_LAYER puede valer, por ejemplo: "DAO" o "ORM"
   - Si no está definida, se usa "DAO" por defecto
   - Se pasa a mayúsculas para evitar errores por diferencias de formato
*/
const modo = (process.env.DATA_LAYER || "DAO").toUpperCase();

/*
   Se exporta dinámicamente el módulo correspondiente según el modo elegido:
   - Si el modo es "ORM", se usa la implementación basada en ORM (Prisma, Sequelize, etc.)
   - En cualquier otro caso, se usa la implementación DAO (acceso manual a BD)
*/
module.exports =
  modo === "ORM"
    ? require("./ProductosORM")
    : require("./ProductosDAO");
