import Comprador from "../models/Comprador.js";

export async function getComprador (req, res){
    try {
        const comprador = await Comprador.findByPk(req.params.id);
        
        if (!comprador){
            return res.status(401).json({
                message: "Cuenta no encontrada"
            })
        }

        return res.status(200).json({
            comprador
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al consultar el comprador"
        })
    }
}