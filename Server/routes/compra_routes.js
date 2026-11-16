import express from "express";
import {
    createCompra,
    deleteCompra,
    getCompra,
    updateCompraEstado,
} from "../controllers/compra_controller.js";
import { requireAdmin, requireAuth } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", getCompra);
router.get("/:id", getCompra);
router.post("/", createCompra);
router.patch("/:id/estado", requireAdmin, updateCompraEstado);
router.delete("/:id", deleteCompra);

export default router;
