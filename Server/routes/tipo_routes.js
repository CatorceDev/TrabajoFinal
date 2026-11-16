import express from "express";
import { createTipo, deleteTipo, getTipo, updateTipo } from "../controllers/tipo.js";
import { requireAdmin, requireAuth } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", requireAuth, getTipo);
router.get("/:id", requireAuth, getTipo);
router.post("/", requireAuth, requireAdmin, createTipo);
router.put("/:id", requireAuth, requireAdmin, updateTipo);
router.delete("/:id", requireAuth, requireAdmin, deleteTipo);

export default router;
