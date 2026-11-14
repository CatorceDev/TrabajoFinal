import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Comprador from '../models/Comprador.js'

const router = express.Router()

// Crear un nuevo comprador
