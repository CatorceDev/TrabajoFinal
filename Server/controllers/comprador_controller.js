import Comprador from "../models/Comprador.js";
import bcrypt from "bcryptjs";
import { idGenera } from "../helpers/tokens.js";
import { correoRegistro } from "../services/correo.js";

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

export async function updateMyProfile(req, res, next) {
    try {
        const comprador = await Comprador.findByPk(req.comprador.id);
        if (!comprador) {
            return res.status(404).json({ error: "Cuenta no encontrada" });
        }

        const body = req.body || {};
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const firstLastName = typeof body.firstLastName === "string" ? body.firstLastName.trim() : "";
        const secondLastName = typeof body.secondLastName === "string" ? body.secondLastName.trim() : "";
        const address = typeof body.address === "string" ? body.address.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

        if (!name || name.length > 15) {
            return res.status(400).json({ error: "El nombre es obligatorio y debe tener hasta 15 caracteres" });
        }
        if (!firstLastName || firstLastName.length > 15) {
            return res.status(400).json({ error: "El primer apellido es obligatorio y debe tener hasta 15 caracteres" });
        }
        if (secondLastName.length > 15) {
            return res.status(400).json({ error: "El segundo apellido debe tener hasta 15 caracteres" });
        }
        if (!address || address.length > 200) {
            return res.status(400).json({ error: "La dirección es obligatoria y debe tener hasta 200 caracteres" });
        }
        if (!email || email.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Indica un correo electrónico válido de hasta 80 caracteres" });
        }

        const existingEmail = await Comprador.findOne({ where: { email } });
        if (existingEmail && Number(existingEmail.codigo_cpr) !== Number(comprador.codigo_cpr)) {
            return res.status(409).json({ error: "El correo ya está registrado" });
        }

        const emailChanged = email !== comprador.email;
        const verificationToken = emailChanged ? idGenera() : null;

        const currentPassword = body.currentPassword;
        const newPassword = body.newPassword;
        if (currentPassword || newPassword) {
            if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || !newPassword) {
                return res.status(400).json({ error: "Indica tu contraseña actual y la nueva contraseña" });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres" });
            }
            if (!(await bcrypt.compare(currentPassword, comprador.password))) {
                return res.status(400).json({ error: "La contraseña actual no es correcta" });
            }
            comprador.password = newPassword;
        }

        if (emailChanged) {
            try {
                await correoRegistro({ nombre: name, email, token: verificationToken });
            } catch (error) {
                console.error("No se pudo enviar la confirmación del nuevo correo:", error);
                return res.status(502).json({ error: "No se pudo enviar el correo de confirmación. El perfil no fue modificado." });
            }
        }

        comprador.name = name;
        comprador.firstLastName = firstLastName;
        comprador.secondLastName = secondLastName || null;
        comprador.address = address;
        comprador.email = email;
        if (emailChanged) {
            comprador.verify = false;
            comprador.token = verificationToken;
        }
        await comprador.save();

        return res.status(200).json({
            message: emailChanged
                ? "Perfil actualizado. Confirma tu nuevo correo para volver a iniciar sesión."
                : "Perfil actualizado correctamente",
            comprador: {
                codigo_cpr: comprador.codigo_cpr,
                name: comprador.name,
                firstLastName: comprador.firstLastName,
                secondLastName: comprador.secondLastName,
                email: comprador.email,
                address: comprador.address,
                verify: comprador.verify,
                rol: comprador.rol,
            },
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ error: "El correo ya está registrado" });
        }
        return next(error);
    }
}