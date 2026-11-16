import express from "express";

import { requireAdmin, requireAuth } from "../middleware/verifyToken.js"
import { getComprador, getCompradores } from "../controllers/comprador_controller.js";


const router = express.Router();
router.use(requireAuth)

router.get("/", requireAdmin, getCompradores)
router.get("/:id", getComprador)



export default router;