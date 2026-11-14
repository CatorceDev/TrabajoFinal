const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const productosRoutes = require("./routes/productos");

const app = express();

app.use(cors({
  origin: "http://localhost:5174"
}));

app.use(express.json());

// Rutas de la API
app.use("/api/productos", productosRoutes);

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