import { useEffect } from "react";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verifySesion } from "../services/authServices";

function ProtectedRoute() {
    const [auth, setAuth] = useState(null)
    const [usuario, setUsuario] = useState(null)

    useEffect(()=>{
        const comprobarSesion = async () => {
            try{
                const data = await verifySesion()

                setUsuario(data)
                setAuth(true)
            }   catch(error){
                localStorage.removeItem("token")
                setAuth(false)
            }
        }
        comprobarSesion()
    }, [])
    if (auth === null){
        return <p>Verificando Sesion</p>
    }

    if (!auth){
        return <Navigate to="/login" replace/>
    }

    return <Outlet context={usuario}/>
}

export default ProtectedRoute;