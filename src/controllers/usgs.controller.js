import { getEarthquakeData } from "../services/earthquake.service.js";
import { getEvents } from "../services/event.service.js";

export const getAllEarthquakes = async (_, res, next) => {
    try {
        const source = "USGS";
        const events = await getEvents({ type: "earthquake" });
        return res.status(200).json({
            source,
            count: events.length,
            events,
            message: source === "cache"
                ? "Earthquakes retrieved from cache (may be slightly stale)."
                : "Recent earthquakes fetched and stored successfully.",
            cachedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

export const getLiveEarthquakes = async (req, res, next) => {
    try {
        const { source, events } = await getEarthquakeData();

        if (!events?.length) {
            return res.status(204).json({ message: "No recent earthquakes found." });
        }

        res.status(200).json({
            source,
            count: events.length,
            events,
            message: source === "cache"
                ? "Earthquakes retrieved from cache (may be slightly stale)."
                : "Recent earthquakes fetched and stored successfully.",
            cachedAt: new Date().toISOString(),
        });
    } catch (err) {
        next(err);
    }
};

