import { apiRequest } from "./api.js";

export async function getCompras() {
    const data = await apiRequest("/compras");
    return data.compras;
}

export function createCompra(compra) {
    return apiRequest("/compras", { method: "POST", body: compra });
}

export function updateCompraEstado(id, estado) {
    return apiRequest(`/compras/${id}/estado`, {
        method: "PATCH",
        body: { estado },
    });
}
