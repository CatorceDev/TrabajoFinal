import { useEffect } from "react";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verificarSesion } from "../services/authServices";

function ProtectedRoute() {
    const [auth, setAuth] = useState(null)

    useEffect(()=>{
        const comprobarSesion = async () => {
            try{
                await verificarSesion()
                setAuth(true)
            }   catch(error){
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

    return <Outlet/>
}

export default ProtectedRoute;