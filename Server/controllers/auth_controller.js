import { idGenera } from "../helpers/tokens.js";
import Comprador from "../models/Comprador.js"
import {correoRegistro} from "../services/correo.js"
import Comprador from "../models/Comprador.js"


//TODO: Registrar un nuevo usuario
export const registrar = async (req, res, next) =>{
    try{
        const {name, firstLastName, secondLastName, email, address, password, confirmPassword} = req.body;
        if (!name || !firstLastName || !secondLastName || !email || !address || !password || !confirmPassword){
            console.log("Todos los campos son obligatorios")
            return res.status(400).json({error: "Todos los campos son obligatorios"})
        }
        if (password !== confirmPassword){
            console.log("Las contraseñas no coinciden")
            return res.status(400).json({error: "Las contraseñas no coinciden"})
        }

        const verify = await Comprador.findOne({
            where: { email }
        });

        if (verify){
            console.log("Correo duplicado")
            return res.status(400).json({error: "Correo invalido"})
        }
        const token = idGenera()
        const nuevo = await Comprador.create({
            name,
            firstLastName,
            secondLastName,
            email,
            address,
            password,
            rol: "comprador",
            token,
            verify: false
        });

        const datos = { name, email, token}
        await correoRegistro(datos)

        return res.status(201).json({message: "Registro exitoso. Verifica tu correo para activar tu cuenta"})
    } catch (error){
        if(error.name === "SequelizeUniqueConstraintError"){
            return res.status(400).json({error: "El correo ya esta registrado"})
        }
        next(error);
    }
}


//TODO: Confirmar inscripcion del usuario
export const confirmarInscripcionEnlace = async (req, res)=>{
    const { token } = req.params
    //*token valido
    const comprador = await Comprador.findOne({
        where: {token}
    })

    if (!persona ){
        res.render("login/confirmacion", {
            pagina: "No se pudo encontrar la cuenta",
            mensaje: "Lo lamentamos, no se pudo confirmar la cuenta, intentalo de nuevo"
        })
    }

    //*Confirmar la cuenta del usuario
    persona.token = null
    persona.confirmar = true
    await comprador.save()

    res.render("login/confirmacion", {
        pagina: "Su cuenta se creo exitosamente",
        mensaje: "Felicidades, el registro se termino exitosamente",
        enlace: "/"
    })
}

