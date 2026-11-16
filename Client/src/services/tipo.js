import { apiRequest } from "./api.js";

export async function getTipos() {
    const data = await apiRequest("/tipos");
    return data.tipos;
}

export function createTipo(tipo) {
    return apiRequest("/tipos", { method: "POST", body: tipo });
}

export function updateTipo(id, tipo) {
    return apiRequest(`/tipos/${id}`, { method: "PUT", body: tipo });
}

export function deleteTipo(id) {
    return apiRequest(`/tipos/${id}`, { method: "DELETE" });
}
