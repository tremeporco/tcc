import express from "express";
import { calculateStoichiometryController } from "../controllers/stoichiometryController.js";

const router = express.Router();

router.post("/calculate", calculateStoichiometryController);

export default router;