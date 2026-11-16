import { Compra, Comprador, Especie, Lote, Tipo } from "../models/index.js";
import { handleControllerError } from "../helpers/controllerErrors.js";

const compraIncludes = [
    {
        model: Lote,
        as: "lote",
        include: [{
            model: Especie,
            as: "especie",
            include: [{ model: Tipo, as: "tipo" }],
        }],
    },
    {
        model: Comprador,
        as: "comprador",
        attributes: ["codigo_cpr", "name", "firstLastName", "secondLastName", "email"],
    },
];

export async function createCompra(req, res, next) {
    const body = req.body || {};
    const id_lte = Number(body.id_lte);
    if (!Number.isInteger(id_lte) || id_lte <= 0) {
        return res.status(400).json({ error: "Indica un lote válido para el pedido" });
    }

    try {
        const lote = await Lote.findByPk(id_lte);
        if (!lote) {
            return res.status(404).json({ error: "Lote no encontrado" });
        }

        const codigo_cpr = req.comprador.rol === "admin"
            ? Number(body.codigo_cpr)
            : Number(req.comprador.id);
        if (!Number.isInteger(codigo_cpr) || codigo_cpr <= 0) {
            return res.status(400).json({ error: "Indica un comprador válido para el pedido" });
        }

        const comprador = await Comprador.findOne({
            where: { codigo_cpr, rol: "comprador" },
        });
        if (!comprador) {
            return res.status(404).json({ error: "Comprador no encontrado" });
        }

        if (await Compra.findByPk(id_lte)) {
            return res.status(409).json({ error: "Este lote ya tiene un pedido asociado" });
        }

        const precio_kilo_final = req.comprador.rol === "admin" && body.precio_kilo_final !== undefined
            ? Number(body.precio_kilo_final)
            : Number(lote.precio_kilo_salida);
        if (!Number.isFinite(precio_kilo_final) || precio_kilo_final <= 0) {
            return res.status(400).json({ error: "El precio por kilo debe ser mayor que cero" });
        }

        const compra = await Compra.create({
            id_cmp: id_lte,
            codigo_cpr,
            precio_kilo_final,
            precio_total: Number((Number(lote.kilos) * precio_kilo_final).toFixed(2)),
            estado: "pendiente",
        });
        const completa = await Compra.findByPk(compra.id_cmp, { include: compraIncludes });
        return res.status(201).json({ compra: completa });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function getCompra(req, res, next) {
    try {
        const where = req.comprador.rol === "admin"
            ? undefined
            : { codigo_cpr: req.comprador.id };

        if (req.params.id) {
            const compra = await Compra.findByPk(req.params.id, { include: compraIncludes });
            if (!compra || (where && Number(compra.codigo_cpr) !== Number(req.comprador.id))) {
                return res.status(404).json({ error: "Pedido no encontrado" });
            }
            return res.status(200).json({ compra });
        }

        const compras = await Compra.findAll({
            ...(where ? { where } : {}),
            include: compraIncludes,
            order: [["fecha", "DESC"]],
        });
        return res.status(200).json({ compras });
    } catch (error) {
        return next(error);
    }
}

export async function deleteCompra(req, res, next) {
    try {
        const compra = await Compra.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        if (req.comprador.rol !== "admin" && Number(compra.codigo_cpr) !== Number(req.comprador.id)) {
            return res.status(403).json({ error: "No puedes cancelar el pedido de otro comprador" });
        }

        compra.estado = "cancelada";
        await compra.save();
        return res.status(200).json({ message: "Pedido cancelado", compra });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}

export async function updateCompraEstado(req, res, next) {
    const estadosValidos = ["pendiente", "confirmada", "en_preparacion", "entregada", "cancelada"];
    const { estado } = req.body || {};
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "El estado indicado no es válido" });
    }

    try {
        const compra = await Compra.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        compra.estado = estado;
        await compra.save();
        const actualizada = await Compra.findByPk(compra.id_cmp, { include: compraIncludes });
        return res.status(200).json({ compra: actualizada });
    } catch (error) {
        return handleControllerError(error, res, next);
    }
}
