import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Lote = db.define(
  "Lote",
  {
    id_lte: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_epe: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kilos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    numero_cajas: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: 1 },
    },
    precio_kilo_salida: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    fecha: {
      type: DataTypes.DATE, // DATETIME en MariaDB
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lote",
    timestamps: false,
  }
);

export default Lote;
