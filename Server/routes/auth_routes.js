import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { confirmarInscripcionEnlace, registrar } from '../controllers/auth_controller.js'

const router = express.Router()

// Crear un nuevo comprador
router.post("/nuevo", registrar)
router.get("/confirmarInscripcion/:token", confirmarInscripcionEnlace)

export default router;