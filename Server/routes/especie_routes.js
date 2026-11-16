import express from "express";
import { createEspecie, deleteEspecie, getEspecie, updateEspecie } from "../controllers/especie_controller.js";
import { requireAdmin, requireAuth } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", requireAuth, getEspecie);
router.get("/:id", requireAuth, getEspecie);
router.post("/", requireAuth, requireAdmin, createEspecie);
router.put("/:id", requireAuth, requireAdmin, updateEspecie);
router.delete("/:id", requireAuth, requireAdmin, deleteEspecie);

export default router;
