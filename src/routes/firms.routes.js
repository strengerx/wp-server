import { Router } from "express";
import { getLiveWildFires, getAllWildFires } from "../controllers/firms.controller.js";

const router = Router();

router
    .get("/all", getAllWildFires)
    .get("/live", getLiveWildFires);

export default router;