import { Especie, Lote, Tipo } from "../models/index.js";
import { handleControllerError } from "../helpers/controllerErrors.js";

const especieIncludes = [{ model: Tipo, as: "tipo" }];

function validateEspecie({ nombre, id_tpo, imagen }) {
    if (typeof nombre !== "string" || !nombre.trim()) {
        return "El nombre de la especie es obligatorio";
    }
    if (!Number.isInteger(Number(id_tpo)) || Number(id_tpo) <= 0) {
        return "Selecciona un tipo válido";
    }
    if (imagen !== undefined && imagen !== null && typeof imagen !== "string") {
        return "La imagen debe ser una URL o ruta de texto";
    }
    if (typeof imagen === "string" && imagen.length > 100) {
        return "La referencia de imagen no puede superar 100 caracteres";
    }
    return null;
}

export async function createEspecie(req, res, next) {
    const body = req.body || {};
    const validationError = validateEspecie(body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        if (!(await Tipo.findByPk(body.id_tpo))) {
            return res.status(400).json({ error: "El tipo seleccionado no existe" });
        }

        const especie = await Especie.create({
            nombre: body.nombre.trim(),
            id_tpo: Number(body.id_tpo),
            imagen: body.imagen?.trim() || null,
        });
        const completa = await Especie.findByPk(especie.id_epe, { include: especieIncludes });
        return res.status(201).json({ especie: completa });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function deleteEspecie(req, res, next) {
    try {
        const especie = await Especie.findByPk(req.params.id);
        if (!especie) {
            return res.status(404).json({ error: "Especie no encontrada" });
        }

        if (await Lote.count({ where: { id_epe: especie.id_epe } })) {
            return res.status(409).json({ error: "Elimina primero los lotes asociados a esta especie" });
        }

        await especie.destroy();
        return res.status(200).json({ message: "Especie eliminada" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function updateEspecie(req, res, next) {
    try {
        const especie = await Especie.findByPk(req.params.id);
        if (!especie) {
            return res.status(404).json({ error: "Especie no encontrada" });
        }

        const body = req.body || {};
        const values = {
            nombre: body.nombre === undefined ? especie.nombre : body.nombre,
            id_tpo: body.id_tpo === undefined ? especie.id_tpo : body.id_tpo,
            imagen: body.imagen === undefined ? especie.imagen : body.imagen,
        };
        const validationError = validateEspecie(values);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        if (!(await Tipo.findByPk(values.id_tpo))) {
            return res.status(400).json({ error: "El tipo seleccionado no existe" });
        }

        especie.nombre = values.nombre.trim();
        especie.id_tpo = Number(values.id_tpo);
        especie.imagen = typeof values.imagen === "string" ? values.imagen.trim() || null : null;
        await especie.save();

        const actualizada = await Especie.findByPk(especie.id_epe, { include: especieIncludes });
        return res.status(200).json({ especie: actualizada });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function getEspecie(req, res, next) {
    try {
        if (req.params.id) {
            const especie = await Especie.findByPk(req.params.id, { include: especieIncludes });
            if (!especie) {
                return res.status(404).json({ error: "Especie no encontrada" });
            }
            return res.status(200).json({ especie });
        }

        const especies = await Especie.findAll({
            include: especieIncludes,
            order: [["nombre", "ASC"]],
        });
        return res.status(200).json({ especies });
    } catch (error) {
        return next(error);
    }
}
