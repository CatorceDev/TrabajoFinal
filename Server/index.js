import express from "express"
import cors from "cors"
import db from "./config/database.js";
import compradorRoutes from "./routes/comprador_routes.js";
import authRoutes from "./routes/auth_routes.js"
import compraRoutes from "./routes/compra_routes.js"
import especieRoutes from "./routes/especie_routes.js"
import loteRoutes from "./routes/lote_routes.js"
import tipoRoutes from "./routes/tipo_routes.js"
import { Admin } from "./models/config_admin.js";
import methodOverride from "method-override"
import { DataTypes } from "sequelize";
import { migrateEspecieLoteRelation } from "./models/migrations.js";


const app = express();

// hora de México aunque el servidor esté en otra zona (p. ej. Linux en UTC),
// así el reporte diario corta los días a medianoche local
process.env.TZ = process.env.TZ || "America/Mexico_City";





// Permite PUT/DELETE vía ?_method=PUT
app.use(methodOverride("_method"));

//configuracion del servidor para permitir que el frontend pueda realizar peticiones y acceder a las respuestas de nuestra api
app.use(cors({
  origin: "http://localhost:5173"
}));

//Middleware para parsear json
app.use(express.json());

// Rutas de la API
app.use("/api/comprador", compradorRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/tipos", tipoRoutes)
app.use("/api/lotes", loteRoutes)
app.use("/api/especies", especieRoutes)
app.use("/api/compras", compraRoutes)




console.log("Rutas de autenticacion cargadas")
app.get("/", (req, res)=>{
  res.json({
    mensaje: "API-REST de Lonja Veracruz",
    endpoints: {
      compradores: "/api/compradores",
    }
  })
})


// TODO: Rutas inexistentes
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

//TODO: Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

//TODO: definiendo puerto
const PORT = process.env.PORT || 2900;

async function iniciarServidor() {
  try {
    await db.authenticate();
    console.log("Conectado a MariaDB");

    await db.sync();
    console.log("Modelos sincronizados");

    await migrateEspecieLoteRelation();

    const compraColumns = await db.getQueryInterface().describeTable("compra");
    if (!compraColumns.estado) {
      await db.getQueryInterface().addColumn("compra", "estado", {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pendiente",
      });
      console.log("Columna de estado agregada a compra");
    }

    await(Admin())

    app.listen(PORT, () => {
      console.log(`API funcionando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar:", error);
  }
}

iniciarServidor();