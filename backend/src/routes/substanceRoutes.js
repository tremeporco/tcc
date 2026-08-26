import { Router } from "express";

import {
  searchCompound,
  suggestCompounds,
} from "../controllers/pubchemController.js";

const router = Router();

router.get("/suggestions", suggestCompounds);
router.get("/:name", searchCompound);

export default router;