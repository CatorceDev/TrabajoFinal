import { apiRequest } from "./api.js";

export async function getComprador(id) {
    return apiRequest(`/comprador/${id}`);
}

export async function updateMyProfile(profile) {
    return apiRequest("/comprador/profile", {
        method: "PUT",
        body: profile,
    });
}

export async function getCompradores() {
    const data = await apiRequest("/comprador");
    return data.compradores;
}
