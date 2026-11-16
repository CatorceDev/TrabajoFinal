import { useOutletContext } from "react-router-dom"
import { getComprador } from "../services/compradorServices"
import { useEffect } from "react"
import { useState } from "react"
import "../styles/dashboard.css"


function Dashboard ({context}){
    
    const comprador = useOutletContext()




    return(
        <div className="dashboard"> 
            <section className=" hero-container">
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
            </section>

            <section className="products-container">
                <div className="products-element element-products">
                    <div className="products-buttons">
                        <button id="avaible-products">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M6.75,19.25Q5,17.5 5,15V9l5,5L8.6,15.43L7,13.83V15q0,1.65 1.18,2.82T11,19t2.83-1.18T15,15V11.83q-0.9-0.35-1.45-1.11T13,9t0.55-1.71T15,6.18V2h2V6.18q0.9,0.35 1.45,1.11T19,9t-0.55,1.72T17,11.83V15q0,2.5-1.75,4.25T11,21T6.75,19.25Zm9.96-9.54Q17,9.42 17,9q0-0.43-0.29-0.71T16,8T15.29,8.29T15,9q0,0.42 0.29,0.71T16,10q0.43,0 0.71-0.29ZM16,9Z"/></svg>
                            Lotes disponibles
                        </button>
                        <button id="orders-products">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5.59,21.41Q5,20.83 5,20t0.59-1.41T7,18q0.83,0 1.41,0.59Q9,19.18 9,20T8.41,21.41Q7.83,22 7,22T5.59,21.41Zm10,0Q15,20.83 15,20t0.59-1.41T17,18t1.41,0.59Q19,19.18 19,20t-0.59,1.41T17,22t-1.41-0.59ZM6.15,6l2.4,5h7L18.3,6H6.15ZM5.2,4H19.95q0.57,0 0.88,0.51t0.02,1.04l-3.55,6.4q-0.27,0.5-0.74,0.78T15.55,13H8.1L7,15H19v2H7q-1.13,0-1.7-0.99q-0.58-0.99-0.05-1.96L6.6,11.6L3,4H1V2H4.25L5.2,4Zm3.35,7h7h-7Z"/></svg>
                            Mis pedidos
                        </button>
                    </div>

                    <div className="products-avaible">
                        <span>Selección del Día</span>
                        <h2>Disponibles esta mañana</h2>
                        <p><small>Precios por kilogramo · cantidades sujetas a disponibilidad</small></p>
                        <form action="">
                            <div className="input-search">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z"/></svg>
                                <input type="text" name="search" id="search" />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="products-element element-cart">
                    cart
                </div>
            </section>
        </div>
    )
}

export default Dashboard