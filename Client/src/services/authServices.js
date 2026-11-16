const API_URL = "http://localhost:2900/api/auth"

export async function registrarComprador (formData){
    
    const response = await fetch(`${API_URL}/nuevo`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(formData)
    });


    const data = await response.json();

    if(!response.ok) throw new Error(data.message);
    return data;
}

export const confirmarCorreo = async (token)=>{
    try{
        const response = await fetch(
            `http://localhost:2900/api/auth/confirmarInscripcion/${token}`
        )
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "No se pudo verificar la cuenta")
        }

    }   catch(error){
        console.error("Error al confirmar: ", error)
    }
}

export const verifyCredentials = async (email, password) =>{
    try {
        const response = await fetch(`${API_URL}/signin`, {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json()

        if(!response.ok) throw new Error(data.error || data.message || "Error al iniciar sesion")

        localStorage.setItem("token", data.token)
        return data;
    } catch (error) {
        console.error("Error al iniciar sesion: ", error)
        throw error;
    }
}

export async function verifySesion(){
    const token = localStorage.getItem("token")

    if (!token) throw new Error("No existe una sesión");

    const response = await fetch(`${API_URL}/session`,{
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || "Sesion invalida");
    
    return data
}