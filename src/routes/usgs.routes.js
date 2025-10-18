import { Router } from "express";
import { getLiveEarthquakes, getAllEarthquakes } from "../controllers/usgs.controller.js";

const router = Router();

router
    .get("/all", getAllEarthquakes)
    .get("/live", getLiveEarthquakes)

export default router;