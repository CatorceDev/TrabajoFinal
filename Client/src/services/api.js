const API_URL = "http://localhost:2900/api";

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || "No se pudo completar la solicitud");
    }

    return data;
}
