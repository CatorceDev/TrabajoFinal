import { idGenera } from "../helpers/tokens.js";
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
export const confirmarInscripcionEnlace = async (req, res, next) => {
    try {
        const { token } = req.params;

        console.log("TOKEN RECIBIDO:", token);

        const comprador = await Comprador.findOne({
            where: { token }
        });

        console.log("COMPRADOR ENCONTRADO:", comprador?.email);

        if (!comprador) {
            return res.status(404).json({
                message: "No se encontró la cuenta"
            });
        }

        comprador.token = null;
        comprador.verify = true;

        await comprador.save();

        console.log("COMPRADOR ACTUALIZADO:", comprador.verify);

        return res.status(200).json({
            message: "Cuenta verificada correctamente"
        });

    } catch (error) {
        console.error("ERROR AL CONFIRMAR:", error);
        next(error);
    }
};