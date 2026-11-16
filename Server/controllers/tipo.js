import { Tipo, Especie } from "../models/index.js";
import { handleControllerError } from "../helpers/controllerErrors.js";

export async function createTipo(req, res, next) {
    try {
        const nombre = typeof req.body?.nombre === "string" ? req.body.nombre.trim() : "";
        if (!nombre) {
            return res.status(400).json({ error: "El nombre del tipo es obligatorio" });
        }

        const tipo = await Tipo.create({ nombre });
        return res.status(201).json({ tipo });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function deleteTipo(req, res, next) {
    try {
        const tipo = await Tipo.findByPk(req.params.id);
        if (!tipo) {
            return res.status(404).json({ error: "Tipo no encontrado" });
        }

        if (await Especie.count({ where: { id_tpo: tipo.id_tpo } })) {
            return res.status(409).json({ error: "No se puede eliminar un tipo que tiene productos asociados" });
        }

        await tipo.destroy();
        return res.status(200).json({ message: "Tipo eliminado" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function getTipo(req, res, next) {
    try {
        if (req.params.id) {
            const tipo = await Tipo.findByPk(req.params.id);
            if (!tipo) {
                return res.status(404).json({ error: "Tipo no encontrado" });
            }
            return res.status(200).json({ tipo });
        }

        const tipos = await Tipo.findAll({ order: [["nombre", "ASC"]] });
        return res.status(200).json({ tipos });
    } catch (error) {
        return next(error);
    }
}

export async function updateTipo(req, res, next) {
    try {
        const nombre = typeof req.body?.nombre === "string" ? req.body.nombre.trim() : "";
        if (!nombre) {
            return res.status(400).json({ error: "El nombre del tipo es obligatorio" });
        }

        const tipo = await Tipo.findByPk(req.params.id);
        if (!tipo) {
            return res.status(404).json({ error: "Tipo no encontrado" });
        }

        tipo.nombre = nombre;
        await tipo.save();
        return res.status(200).json({ tipo });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}
