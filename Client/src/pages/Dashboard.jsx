import { useOutletContext } from "react-router-dom"
import { getComprador } from "../services/compradorServices"
import { useEffect } from "react"
import { useState } from "react"
import "../styles/dashboard.css"


function Dashboard ({context}){
    
    const comprador = useOutletContext()




    return(
        <>
            <div className=" hero-container">
                <div className="hero-element element-top">
                    <span>· Mercado Mayorista · Veracruz</span>
                </div>
                <div className="hero-element element-h1">
                    <h1>Lo mejor de la <span>marea de hoy</span></h1>
                    <p><strong>La pesca de esta mañana, lista para tu negocio</strong></p>
                </div>
                <div className="hero-element element-bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M13.41,11.41Q14,10.83 14,10q0-0.83-0.59-1.41T12,8T10.59,8.59T10,10t0.59,1.41T12,12t1.41-0.59ZM12,19.35q3.05-2.8 4.53-5.09Q18,11.98 18,10.2q0-2.73-1.74-4.46Q14.53,4 12,4T7.74,5.74Q6,7.47 6,10.2q0,1.78 1.48,4.06T12,19.35ZM12,22q-4.02-3.43-6.01-6.36T4,10.2Q4,6.45 6.41,4.22T12,2t5.59,2.22T20,10.2q0,2.5-1.99,5.44Q16.03,18.58 12,22Zm0-12Z"/></svg>
                    <p><strong>Muelle de Veracruz</strong> <span>|</span> </p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M15.3,16.7l1.4-1.4L13,11.6V7H11v5.4l4.3,4.3ZM12,22q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-10Zm0,8q3.33,0 5.66-2.34T20,12q0-3.33-2.34-5.66T12,4Q8.68,4 6.34,6.34T4,12t2.34,5.66T12,20Z"/></svg>
                    <p><strong>Ingreso desde las 02:00</strong></p>
                </div>
            </div>
        </>
    )
}

export default Dashboard