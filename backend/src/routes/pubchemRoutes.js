import { Router } from "express";
import { searchCompound } from "../controllers/pubchemController.js";

const router = Router();

router.get("/:name", searchCompound);

export default router;