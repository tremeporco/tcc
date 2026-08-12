import { Router } from "express";
import { searchElement } from "../controllers/pubchemController.js";

const router = Router();

router.get("/:number", searchElement);

export default router;