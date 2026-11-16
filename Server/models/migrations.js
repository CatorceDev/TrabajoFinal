import db from "../config/database.js";
import { DataTypes } from "sequelize";

export async function migrateEspecieLoteRelation() {
    const queryInterface = db.getQueryInterface();
    const speciesColumns = await queryInterface.describeTable("especie");
    const lotColumns = await queryInterface.describeTable("lote");
    const hasLegacyRelation = Boolean(speciesColumns.id_lte);

    if (hasLegacyRelation) {
        const [duplicateRelations] = await db.query(
            "SELECT id_lte FROM especie WHERE id_lte IS NOT NULL GROUP BY id_lte HAVING COUNT(*) > 1"
        );
        if (duplicateRelations.length) {
            throw new Error("No se puede migrar: hay lotes asociados a más de una especie. Resuelve esas relaciones y reinicia el servidor.");
        }
    }

    if (!lotColumns.id_epe) {
        await queryInterface.addColumn("lote", "id_epe", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "especie", key: "id_epe" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        });
    }

    if (!hasLegacyRelation) return;

    await db.query(
        "UPDATE lote AS l JOIN especie AS e ON e.id_lte = l.id_lte SET l.id_epe = e.id_epe WHERE l.id_epe IS NULL"
    );

    const legacyForeignKeys = await queryInterface.getForeignKeyReferencesForTable("especie");
    for (const foreignKey of legacyForeignKeys.filter((item) => item.columnName === "id_lte")) {
        await queryInterface.removeConstraint("especie", foreignKey.constraintName);
    }

    await queryInterface.removeColumn("especie", "id_lte");
}
