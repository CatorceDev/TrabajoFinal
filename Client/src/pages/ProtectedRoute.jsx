import { useEffect } from "react";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verifySesion } from "../services/authServices";

function ProtectedRoute() {
    const [auth, setAuth] = useState(null)

    useEffect(()=>{
        const comprobarSesion = async () => {
            try{
                await verifySesion()
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

    return <Outlet/>
}

export default ProtectedRoute;