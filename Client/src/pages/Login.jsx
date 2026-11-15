import { useState } from 'react';
import '../styles/login.css'
import { registrarComprador, verifyCredentials } from '../services/authServices';
import { useNavigate } from 'react-router-dom';


function Login(){
    const navigate = useNavigate()
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        name: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        address: '',
        password: '', 
        confirmPassword: ''
    })

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })


    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleLoginChange = (e) =>{
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await registrarComprador(formData);
            alert(response.message)

            setMode("login")

        }   catch (error){
            console.log(error.message)
        }
    }

    const handleLogin = async (e) =>{
        console.log(loginData.email, loginData.password)
        e.preventDefault()
        try{
            const response = await verifyCredentials(loginData.email, loginData.password)
            
            navigate("/")
        }   catch(error){
            console.log(error.message)
        }
    }



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
            <div className="container container-form">
                <div className='container-form-content'>
                    <div className='container-button-form'>
                        <div className='text-welcome'>
                            <p className='welcome-title'><strong>Acceso de compradores</strong></p>
                            <p className='welcome-text'>Qué bueno verte.</p>
                            <p className='welcome-instructions'>Ingresa tus datos para continuar</p>
                        </div>
                        <div className='select-login'>
                            <button className={mode == "login" ? "selected" : ""} onClick={()=> setMode("login")}>Iniciar sesión</button>
                            <button className={mode == "register" ? "selected" : ""} onClick={()=> setMode("register")}>Crear cuenta</button>
                        </div>
                    </div>
                    <div className='container-form-element'>
                        {mode == "login" ? (
                            <form onSubmit={handleLogin}>
                                <div className='form-element'>
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input type="email" name="email" id="email" placeholder='example@example.com' value={loginData.email} onChange={handleLoginChange} autoComplete='email'/>
                                </div>
                                <div className='form-element'>
                                    <label htmlFor="password">Contraseña</label>
                                    <input type="password" name="password" id="password" placeholder='Escribe tu contraseña' value={loginData.password} onChange={handleLoginChange} autoComplete='current-password'/>
                                </div>
                                <button id='login-button'>Entrar a mi cuenta
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#e3e3e3"><path d="M16.18,13H4V11H16.18l-5.6-5.6L12,4l8,8l-8,8l-1.42-1.4l5.6-5.6Z"/></svg>
                                </button>
                            </form>
                        ):(
                            //TODO: 
                            <form onSubmit={handleSubmit}>
                                <div className='form-element'>
                                    <label htmlFor="name">Nombre</label>
                                    <input type="text" name="name" id="name" placeholder='Escribe tu nombre' value={formData.name} onChange={handleChange} autoComplete='given-name'/>
                                    <label htmlFor="firstLastName">Apellido</label>
                                    <input type="text" name="firstLastName" id="firstLastName" placeholder='Escribe tu apellido' value={formData.firstLastName} onChange={handleChange} autoComplete='family-name'/>
                                    <label htmlFor="secondLastName">Segundo apellido</label>
                                    <input type="text" name="secondLastName" id="secondLastName" placeholder='Escribe tu segundo apellido' value={formData.secondLastName} onChange={handleChange} autoComplete='additional-name'/>
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input type="email" name="email" id="email" placeholder='example@example.com' value={formData.email} onChange={handleChange} autoComplete='email'/>
                                    <label htmlFor="address">Direccion</label>
                                    <input type="text" name="address" id="address" placeholder='Escribe tu direccion' value={formData.address} onChange={handleChange} autoComplete='street-address'/>
                                </div>
                                <div className='form-element form-element-password'>
                                    <div>
                                        <label htmlFor="password">Contraseña</label>
                                        <input type="password" name="password" id="password" placeholder='Escribe tu contraseña' value={formData.password} onChange={handleChange} autoComplete='new-password'/>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                        <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirma tu contraseña' value={formData.confirmPassword} onChange={handleChange} autoComplete='new-password'/>
                                    </div>
                                </div>
                                <button id='login-button'>Entrar a mi cuenta
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#e3e3e3"><path d="M16.18,13H4V11H16.18l-5.6-5.6L12,4l8,8l-8,8l-1.42-1.4l5.6-5.6Z"/></svg>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
export default Login