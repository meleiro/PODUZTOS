const { PrismaClient, Prisma} = require("@prisma/client");
const { PrismaPg }= require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pgPool = new Pool({
   connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pgPool);

const prisma = new PrismaClient({ adapter });

async function obtenerTodos(){

    const items = await prisma.producto.findMany({

        include: { digital: true},
        orderBy: {id: "asc"}       

    });

    return items.map(p => ({

        id: p.id,
        nombre: p.nombre,
        precio: p.precio.toString(),
        stock: p.stock,
        tipo: p.tipo,
        tamano_descarga_mb: p.digital ? p.digital.tamano_descarga_mb : null

    }));


}