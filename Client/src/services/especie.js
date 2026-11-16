import { apiRequest } from "./api.js";

export async function getEspecies() {
    const data = await apiRequest("/especies");
    return data.especies;
}

export function createEspecie(especie) {
    return apiRequest("/especies", { method: "POST", body: especie });
}

export function updateEspecie(id, especie) {
    return apiRequest(`/especies/${id}`, { method: "PUT", body: especie });
}

export function deleteEspecie(id) {
    return apiRequest(`/especies/${id}`, { method: "DELETE" });
}
