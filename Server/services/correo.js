import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config({path: 'env'})

const correoRegistro = async(info)=>{
    const transport = nodemailer.createTransport({
        host: process.env.CORREO_HOST,
        port: process.env.CORREO_PORT,
        secure: false,
        auth: {
            user: process.env.CORREO_USER,
            pass: process.env.CORREO_PASS,
        }
    })
    const { nombre, email, token } = info
    await transport.sendMail({
        from: process.env.CORREO_USER,
        to: email, 
        subject: 'CONFIRMA TU REGISTRO A LONJA VERACRUZ',
        html: `
        <p>Como estas ${nombre}, para terminar porfavor comprueba la cuenta</p>
        <p>Confirma en el siguiente enlace: 
            <a href="http://localhost:5173/confirmarinscripcion/${token}">Confirmar</a>
        </p>
        <p>Si no solicitaste el registro, porfavor ignora el mensaje</p>
        `
    })
}

export {
    correoRegistro
}