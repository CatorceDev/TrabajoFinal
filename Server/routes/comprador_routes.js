import express from "express";
import Comprador from "../models/Comprador.js"
import {requireAuth} from "../middleware/verifyToken.js"


const router = express.Router();
router.use(requireAuth)




export default router;