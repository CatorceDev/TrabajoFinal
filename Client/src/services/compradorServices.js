const API_URL = "http://localhost:2900/api/comprador"

export async function getComprador (id){
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers:{
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })


    const data = await response.json()
    
    if(!response.ok) throw new Error(data.message || "Error al obtener al comprador");

    return data

}