import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Comprador from '../models/Comprador.js'

const router = express.Router()

// Crear un nuevo comprador
router.post("/nuevo", async (req, res, next)=>{
    console.log(req.body)
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

    try{
        const nuevo = await Comprador.create({
            name,
            firstLastName,
            secondLastName,
            email,
            address,
            password
        });
        res.status(201).json(nuevo);
    } catch (error){
        if(error.name === "SequelizeUniqueConstraintError"){
            return res.status(400).json({error: "El correo ya esta registrado"})
        }
        next(error);
    }
})

export default router;