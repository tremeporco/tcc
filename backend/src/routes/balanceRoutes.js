import { Router } from "express";
import { balance } from "../controllers/balanceController.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.post("/", optionalAuth, balance);

export default router;