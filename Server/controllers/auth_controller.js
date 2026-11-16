import { idGenera } from "../helpers/tokens.js";
import {correoRegistro} from "../services/correo.js"
import Comprador from "../models/Comprador.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

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
            password: password,
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

        const comprador = await Comprador.findOne({
            where: { token }
        });

        if (!comprador) {
            return res.status(404).json({
                message: "No se encontró la cuenta"
            });
        }

        comprador.token = null;
        comprador.verify = true;

        await comprador.save();

        return res.status(200).json({
            message: "Cuenta verificada correctamente"
        });

    } catch (error) {
        console.error("ERROR AL CONFIRMAR:", error);
        next(error);
    }
};

export const verifySignIn = async (req, res, next) =>{
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
        }

        const comprador = await Comprador.findOne({
            where: { email }
        })

        if(!comprador){
            return res.status(401).json({error: "Credenciales incorrectas"})
        }

        const coincide = await bcrypt.compare(password, comprador.password)

        if (!coincide){
            return res.status(401).json({error: "Credenciales incorrectas"})
        }

        if (!comprador.verify) {
            return res.status(403).json({ error: "Verifica tu correo antes de iniciar sesión" });
        }

        const token = jwt.sign(
            {
                id: comprador.codigo_cpr,
                email: comprador.email,
                rol: comprador.rol
            },
            process.env.JWTSECRET,
            {
                expiresIn: "1h"
            }
        )

        return res.status(200).json({
            message: "Inicio de sesion exitoso",
            token
        })

    } catch (error) {
        next(error)
    }
}

export const verifySession = async (req, res, next) => {
    try {
        const comprador = await Comprador.findByPk(req.comprador.id, {
            attributes: ["codigo_cpr", "name", "firstLastName", "secondLastName", "email", "rol", "verify"],
        });

        if (!comprador) {
            return res.status(401).json({ error: "La cuenta asociada a esta sesión ya no existe" });
        }

        return res.status(200).json({
            message: "Sesion válida",
            comprador: {
                id: comprador.codigo_cpr,
                name: comprador.name,
                firstLastName: comprador.firstLastName,
                secondLastName: comprador.secondLastName,
                email: comprador.email,
                rol: comprador.rol,
                verify: comprador.verify,
            },
        });
    } catch (error) {
        return next(error);
    }
}