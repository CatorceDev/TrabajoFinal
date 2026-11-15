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
        console.log("Enviando peticion al backend")
        console.log("TOKEN", token)

        const response = await fetch(
            `http://localhost:2900/api/auth/confirmarInscripcion/${token}`
        )
        console.log("respuesta recibida")
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "No se pudo verificar la cuenta")
        }

        console.log("Respuesta del backend: ", data)

        

    }   catch(error){
        console.error("Error al confirmar: ", error)
    }
}


export async function verificarSesion(){
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/verificar`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok){
        throw new Error (data.message || "Sesion invalida")
    }
    return data
}