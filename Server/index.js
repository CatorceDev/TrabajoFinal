import express from "express"
import cors from "cors"
import db from "./config/database.js";
import compradorRoutes from "./routes/comprador_routes.js";
import authRoutes from "./routes/auth_routes.js"


const app = express();


//configuracion del servidor para permitir que el frontend pueda realizar peticiones y acceder a las respuestas de nuestra api
app.use(cors({
  origin: "http://localhost:5173"
}));

//Middleware para parsear json
app.use(express.json());

// Rutas de la API
app.use("/api/compradores", compradorRoutes);
app.use("/api/auth", authRoutes)
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

    app.listen(PORT, () => {
      console.log(`API funcionando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar:", error);
  }
}

iniciarServidor();