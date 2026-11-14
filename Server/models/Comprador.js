import { DataTypes } from "sequelize";
import db from "../config/database.js";
import { toDefaultValue } from "sequelize/lib/utils";

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
    },
    verify:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "comprador"
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "comprador",
    timestamps: false,
  }
);

export default Comprador;
