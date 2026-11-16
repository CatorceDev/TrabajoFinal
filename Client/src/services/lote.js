import { apiRequest } from "./api.js";

export async function getLotes() {
    const data = await apiRequest("/lotes");
    return data.lotes;
}

export function createLote(lote) {
    return apiRequest("/lotes", { method: "POST", body: lote });
}

export function updateLote(id, lote) {
    return apiRequest(`/lotes/${id}`, { method: "PUT", body: lote });
}

export function deleteLote(id) {
    return apiRequest(`/lotes/${id}`, { method: "DELETE" });
}
