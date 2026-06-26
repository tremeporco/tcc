import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  createHistory,
  getHistory,
  updateHistory,
  deleteHistory,
} from "../controllers/historyController.js";

const router = Router();

router.post("/create", requireAuth, createHistory);
router.get("/", requireAuth, getHistory);
router.put("/:id", requireAuth, updateHistory);
router.delete("/:id", requireAuth, deleteHistory);

export default router;