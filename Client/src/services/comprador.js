import { apiRequest } from "./api.js";

export async function getComprador(id) {
    return apiRequest(`/comprador/${id}`);
}

export async function getCompradores() {
    const data = await apiRequest("/comprador");
    return data.compradores;
}
