import express from "express";

import { requireAdmin, requireAuth } from "../middleware/verifyToken.js"
import { getComprador, getCompradores, updateMyProfile } from "../controllers/comprador_controller.js";


const router = express.Router();
router.use(requireAuth)

router.put("/profile", updateMyProfile)
router.get("/", requireAdmin, getCompradores)
router.get("/:id", getComprador)



export default router;