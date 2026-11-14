import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Comprador = db.define(
  "Comprador",
  {
    codigo_cpr: {
      type: DataTypes.SMALLINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    firstLastName: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    secondLastName: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    }
  },
  {
    tableName: "comprador",
    timestamps: false,
  }
);

export default Comprador;
