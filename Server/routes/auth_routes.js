import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { confirmarInscripcionEnlace, registrar, verifySession, verifySignIn } from '../controllers/auth_controller.js'
import { requireAuth } from '../middleware/verifyToken.js'

const router = express.Router()

// Crear un nuevo comprador
router.post("/nuevo", registrar)
router.get("/confirmarInscripcion/:token", confirmarInscripcionEnlace)
router.post("/signin", verifySignIn)
router.get("/session", requireAuth, verifySession)
export default router;