import { Compra, Especie, Lote, Tipo } from "../models/index.js";
import { handleControllerError } from "../helpers/controllerErrors.js";

const loteIncludes = [
    {
        model: Especie,
        as: "especie",
        include: [{ model: Tipo, as: "tipo" }],
    },
    { model: Compra, as: "compra", attributes: ["id_cmp", "estado"] },
];

function validPositiveNumber(value) {
    return value !== undefined && Number.isFinite(Number(value)) && Number(value) > 0;
}

function validLote(body) {
    const id_epe = Number(body.id_epe);
    if (!Number.isInteger(id_epe) || id_epe <= 0) return "Selecciona una especie válida";
    if (!validPositiveNumber(body.kilos)) return "Los kilos deben ser mayores que cero";
    if (!validPositiveNumber(body.numero_cajas) || !Number.isInteger(Number(body.numero_cajas))) {
        return "El número de cajas debe ser un entero mayor que cero";
    }
    if (!validPositiveNumber(body.precio_kilo_salida)) return "El precio por kilo debe ser mayor que cero";
    return null;
}

export async function createLote(req, res, next) {
    const body = req.body || {};
    const validationError = validLote(body);
    if (validationError) return res.status(400).json({ error: validationError });

    try {
        if (!(await Especie.findByPk(body.id_epe))) {
            return res.status(400).json({ error: "La especie seleccionada no existe" });
        }

        const lote = await Lote.create({
            id_epe: Number(body.id_epe),
            kilos: body.kilos,
            numero_cajas: body.numero_cajas,
            precio_kilo_salida: body.precio_kilo_salida,
            ...(body.fecha ? { fecha: body.fecha } : {}),
        });
        const completo = await Lote.findByPk(lote.id_lte, { include: loteIncludes });
        return res.status(201).json({ lote: completo });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function deleteLote(req, res, next) {
    try {
        const lote = await Lote.findByPk(req.params.id);
        if (!lote) {
            return res.status(404).json({ error: "Lote no encontrado" });
        }

        if (await Compra.findByPk(lote.id_lte)) {
            return res.status(409).json({ error: "No se puede eliminar un lote con pedidos asociados" });
        }

        await lote.destroy();
        return res.status(200).json({ message: "Lote eliminado" });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function updateLote(req, res, next) {
    try {
        const lote = await Lote.findByPk(req.params.id);
        if (!lote) {
            return res.status(404).json({ error: "Lote no encontrado" });
        }

        const body = req.body || {};
        const values = {
            id_epe: body.id_epe === undefined ? lote.id_epe : body.id_epe,
            kilos: body.kilos === undefined ? lote.kilos : body.kilos,
            numero_cajas: body.numero_cajas === undefined ? lote.numero_cajas : body.numero_cajas,
            precio_kilo_salida: body.precio_kilo_salida === undefined ? lote.precio_kilo_salida : body.precio_kilo_salida,
        };
        const validationError = validLote(values);
        if (validationError) return res.status(400).json({ error: validationError });

        if (!(await Especie.findByPk(values.id_epe))) {
            return res.status(400).json({ error: "La especie seleccionada no existe" });
        }
        if (await Compra.findByPk(lote.id_lte)) {
            return res.status(409).json({ error: "No se puede modificar un lote con pedidos asociados" });
        }

        lote.id_epe = Number(values.id_epe);
        lote.kilos = values.kilos;
        lote.numero_cajas = values.numero_cajas;
        lote.precio_kilo_salida = values.precio_kilo_salida;
        if (body.fecha !== undefined) lote.fecha = body.fecha;
        await lote.save();

        const actualizado = await Lote.findByPk(lote.id_lte, { include: loteIncludes });
        return res.status(200).json({ lote: actualizado });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function getLote(req, res, next) {
    try {
        if (req.params.id) {
            const lote = await Lote.findByPk(req.params.id, { include: loteIncludes });
            if (!lote) {
                return res.status(404).json({ error: "Lote no encontrado" });
            }
            return res.status(200).json({ lote });
        }

        const lotes = await Lote.findAll({
            include: loteIncludes,
            order: [["fecha", "DESC"]],
        });
        return res.status(200).json({ lotes });
    } catch (error) {
        return next(error);
    }
}
