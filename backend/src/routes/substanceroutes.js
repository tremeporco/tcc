import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  createSubstance,
  getSubstances,
  updateSubstance,
  deleteSubstance,
} from "../controllers/substanceController.js";

const router = Router();

router.post("/", requireAuth, createSubstance);
router.get("/", requireAuth, getSubstances);
router.put("/:id", requireAuth, updateSubstance);
router.delete("/:id", requireAuth, deleteSubstance);

export default router;