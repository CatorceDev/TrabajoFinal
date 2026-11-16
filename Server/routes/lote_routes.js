import express from "express";
import { createLote, deleteLote, getLote, updateLote } from "../controllers/lote.js";
import { requireAdmin, requireAuth } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", requireAuth, getLote);
router.get("/:id", requireAuth, getLote);
router.post("/", requireAuth, requireAdmin, createLote);
router.put("/:id", requireAuth, requireAdmin, updateLote);
router.delete("/:id", requireAuth, requireAdmin, deleteLote);

export default router;
