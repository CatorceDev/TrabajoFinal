import { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/login.css'
import '../styles/confirmationEmail.css'
import { confirmarCorreo } from '../services/authServices';
import {Link} from "react-router-dom"
import { useEffect } from 'react';

function Login(){
    const {token} = useParams();
    console.log("Entre al componente de confirmacion")
    console.log("TOKEN", token)
    
    useEffect(()=>{
        
        confirmarCorreo(token)
    })

    return(
        <main>
            <div className="container container-info">
                <div className="info-element info-top">
                    <div className="info-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2,18V16q0.95,0 1.41-0.5T5.35,15t1.94,0.5T8.65,16q0.95,0 1.41-0.5Q10.53,15 12,15q1.43,0 1.94,0.5T15.35,16q0.95,0 1.39-0.5T18.65,15t1.94,0.5T22,16v2q-1.42,0-1.94-0.5T18.65,17t-1.36,0.5T15.35,18q-1.43,0-1.94-0.5T12,17q-0.95,0-1.41,0.5T8.65,18T6.74,17.5T5.35,17T3.94,17.5Q3.48,18 2,18Zm0-4V12q0.95,0 1.41-0.5T5.35,11q1.42,0 1.91,0.5T8.65,12q0.95,0 1.41-0.5Q10.53,11 12,11q1.43,0 1.93,0.5T15.3,12q0.95,0 1.41-0.5T18.65,11q1.43,0 1.94,0.5T22,12v2q-1.47,0-1.96-0.5T18.65,13t-1.36,0.5T15.35,14q-1.43,0-1.94-0.5T12,13q-0.95,0-1.39,0.5T8.7,14T6.74,13.5T5.35,13T3.94,13.5T2,14Zm0-4V8Q2.95,8 3.41,7.5T5.35,7Q6.78,7 7.26,7.5T8.65,8Q9.6,8 10.06,7.5Q10.53,7 12,7q1.43,0 1.93,0.5T15.3,8q0.95,0 1.41-0.5T18.65,7q1.43,0 1.94,0.5T22,8v2q-1.47,0-1.96-0.5T18.65,9T17.29,9.5T15.35,10q-1.43,0-1.94-0.5T12,9q-0.95,0-1.39,0.5T8.7,10T6.74,9.5T5.35,9T3.94,9.5T2,10Z"/></svg>
                    </div>
                    <div className="info-title">
                        <h1>Lonja de Veracruz</h1>
                        <p><strong>Mercado Mayorista · Veracruz</strong></p>
                    </div>
                </div>
                <div className="info-element info-center">
                    <div className='info-content info-tagline'>
                        <p><span>──</span><span>El mercado empieza aqui</span></p>
                    </div>
                    <div className='info-content info-slogan'>
                        <p>Cada jornada, con un <span>rumbo claro</span></p>
                    </div>
                    <div className='info-content info-description'>
                        <p>Un punto de partida más ordenado para quienes compran cada día en la lonja de Veracruz</p>
                    </div>
                </div>
                <div className="info-element info-bottom">
                    <p className='end-slogan'>Una mañana bien organizada</p>
                    <p className='end-phrase'>Del muelle a tu negocio</p>
                </div>
            </div>
            <div className='container-emailverify'>
                <div className='emailverify-element'>
                    <svg className='email-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M15.95,22L11.7,17.75l1.4-1.4l2.85,2.85l5.65-5.65l1.4,1.4L15.95,22ZM12,11l8-5H4l8,5Zm0,2L4,8V18H9.15l2,2H4q-0.82,0-1.41-0.59T2,18V6Q2,5.18 2.59,4.59T4,4H20q0.83,0 1.41,0.59Q22,5.18 22,6v4.35l-2,2V8l-8,5Zm0,0Zm0-2Zm0,2Z"/></svg>
                    <p>Correo Electronico</p>
                    <h2>Correo Confirmado</h2>
                    <div>
                        <p>Tu correo ha sido confirmado. Ya puedes continuar con tu inicio de sesión</p>
                        <p><span>──</span> Acceso a compradores · Veracruz</p>
                    </div>
                    <Link className='link-login' to="/login">Ir a iniciar sesion 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M16.18,13H4V11H16.18l-5.6-5.6L12,4l8,8l-8,8l-1.42-1.4l5.6-5.6Z"/></svg>
                    </Link>
                </div>
            </div>
        </main>
    );
}
export default Login