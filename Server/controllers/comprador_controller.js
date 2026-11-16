import Comprador from "../models/Comprador.js";

export async function getCompradores(req, res, next) {
    try {
        const compradores = await Comprador.findAll({
            where: { rol: "comprador" },
            attributes: ["codigo_cpr", "name", "firstLastName", "secondLastName", "email", "verify"],
            order: [["name", "ASC"], ["firstLastName", "ASC"]],
        });

        return res.status(200).json({ compradores });
    } catch (error) {
        return next(error);
    }
}

export async function getComprador(req, res, next) {
    try {
        if (req.comprador.rol !== "admin" && Number(req.params.id) !== Number(req.comprador.id)) {
            return res.status(403).json({ error: "No puedes consultar los datos de otro comprador" });
        }

        const comprador = await Comprador.findByPk(req.params.id, {
            attributes: ["codigo_cpr", "name", "firstLastName", "secondLastName", "email", "address", "verify", "rol"],
        });
        
        if (!comprador){
            return res.status(404).json({ error: "Cuenta no encontrada" });
        }

        return res.status(200).json({ comprador });
    } catch (error) {
        return next(error);
    }
}