import { getCompradores } from "./comprador.js";
import { getCompras } from "./compra.js";
import { getEspecies } from "./especie.js";
import { getLotes } from "./lote.js";
import { getTipos } from "./tipo.js";

export async function getAdminData() {
    const [especies, lotes, tipos, compradores, compras] = await Promise.all([
        getEspecies(),
        getLotes(),
        getTipos(),
        getCompradores(),
        getCompras(),
    ]);

    return { especies, lotes, tipos, compradores, compras };
}
