import { DataTypes } from "sequelize";
import db from "../config/database.js";

// Cada lote se compra una sola vez: id_cmp es la llave primaria
// y al mismo tiempo la llave foránea hacia lote.id_lte (relación 1 a 1)
const Compra = db.define(
  "Compra",
  {
    id_cmp: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    codigo_cpr: {
      // FK -> comprador
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    precio_kilo_final: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    precio_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [["pendiente", "confirmada", "en_preparacion", "entregada", "cancelada"]],
      },
    },
    fecha: {
      type: DataTypes.DATE, // DATETIME en MariaDB
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "compra",
    timestamps: false,
  }
);

export default Compra;
