import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { registrar } from '../controllers/auth_controller.js'

const router = express.Router()

// Crear un nuevo comprador
router.post("/nuevo", registrar)

export default router;