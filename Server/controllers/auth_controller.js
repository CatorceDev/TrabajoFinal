import Comprador from "../models/Comprador.js"
import correoRegistro from "../services/correo.js"

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

        const nuevo = await Comprador.create({
            name,
            firstLastName,
            secondLastName,
            email,
            address,
            password,
            rol: "comprador"
        });

        const datos = { name, email, token}
        correoRegistro(datos)

        res.redirect("/")
    } catch (error){
        if(error.name === "SequelizeUniqueConstraintError"){
            return res.status(400).json({error: "El correo ya esta registrado"})
        }
        next(error);
    }
}
