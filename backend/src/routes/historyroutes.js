import { Router } from "express";

import {
    createHistory,
    getHistory,
    updateHistory,
    deleteHistory
} from "../controllers/historyController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createHistory);

router.get("/", requireAuth, getHistory);

router.put("/:id", requireAuth, updateHistory);

router.delete("/:id", requireAuth, deleteHistory);

export default router;