import Header from "../components/Header.jsx"
import { useEffect } from "react"
import { Outlet, useOutletContext } from "react-router-dom"
import { useState } from "react"
import { getComprador } from "../services/comprador.js"

function DashboardLayout () {
    const data = useOutletContext()

    const [comprador, setComprador] = useState(null)


    useEffect(()=>{
        const id = data.comprador.id
        const obtenerComprador = async()=>{
            try {
                const data = await getComprador(id)
                setComprador(data.comprador)
            } catch (error) {
                console.error(error)
            }
        }
        obtenerComprador()
    }, [])
    
    return(
        <div className="dashboard-container">
            <Header context={comprador}/>
            <main>
                <Outlet context={comprador}/>
            </main>
        </div>
    )
}

export default DashboardLayout;