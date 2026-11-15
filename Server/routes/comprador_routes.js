import express from "express";

import {requireAuth} from "../middleware/verifyToken.js"
import { getComprador } from "../controllers/comprador_controller.js";


const router = express.Router();
router.use(requireAuth)

router.get("/:id", requireAuth, getComprador)



export default router;