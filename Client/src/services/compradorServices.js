const API_URL = "http://localhost:2900/api/compradores"

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