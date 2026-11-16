import Comprador from "./Comprador.js";
import Tipo from "./Tipo.js";
import Lote from "./Lote.js";
import Especie from "./Especie.js";
import Compra from "./Compra.js";

// Asociaciones (según el diseño relacional)

// Especie 1 --- N Lote
Especie.hasMany(Lote, { foreignKey: "id_epe", as: "lotes", onDelete: "RESTRICT" });
Lote.belongsTo(Especie, { foreignKey: "id_epe", as: "especie" });

// Tipo 1 --- N Especie
Tipo.hasMany(Especie, { foreignKey: "id_tpo", as: "especies", onDelete: "RESTRICT" });
Especie.belongsTo(Tipo, { foreignKey: "id_tpo", as: "tipo" });

// Lote 1 --- 1 Compra
Lote.hasOne(Compra, { foreignKey: "id_cmp", as: "compra", onDelete: "RESTRICT" });
Compra.belongsTo(Lote, { foreignKey: "id_cmp", as: "lote" });

// Comprador 1 --- N Compra
Comprador.hasMany(Compra, { foreignKey: "codigo_cpr", as: "compras", onDelete: "RESTRICT" });
Compra.belongsTo(Comprador, { foreignKey: "codigo_cpr", as: "comprador" });


export { Comprador, Tipo, Lote, Especie, Compra };
