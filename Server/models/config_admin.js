import dotenv from "dotenv"
import { Comprador, Tipo } from "./index.js"

dotenv.config()

export async function Admin(params) {
    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUser || !adminPassword) console.warn("No se definieron ADMIN_USER o ADMIN_PASSWORD en el .env");
    else{
        try {
            //TODO: Verificar si el usuario ya existe para no duplicarlo
            const existe = await Comprador.findOne({where: adminUser})
            if (existe) console.log("Usuario administrador configurado");
            else{
                await Comprador.create({
                    name: adminUser,
                    firstLastName: "Lonja",
                    secondLastName: "Veracruz",
                    email: "admin@lonjaveracruz.mx",
                    password: adminPassword,
                    rol: "admin",
                    veri: true,
                    address: "Lonja direction #123"
                })
                console.log("Usuario administrador configurado")
            }
        } catch (error) {
            console.error("Error al crear el usuario administrador: ", error)
        }
    }

    //TODO: Catalogo inicial de tipos (solo si la tabla esta vacia)
    if(await Tipo.count() === 0){
        await Tipo.bulkCreate([
            {nombre: "Pescado"},
            {nombre: "Crustaceo"},
            {nombre: "Molusco"},
            {nombre: "Cefalopodo"}
        ])
        console.log("Catalogo de tipos inicial creado")
    }
}