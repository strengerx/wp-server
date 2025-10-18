import { getEvents } from "../services/event.service.js";
import { getWildfireData } from "../services/wildfire.service.js";

export const getAllWildFires = async (_, res, next) => {
    try {
        const source = "NASA FIRMS";
        const events = await getEvents({ type: "wildfire" });
        if (!events?.length) {
            return res.status(204).json({ message: "No recent Wildfire found." });
        }

        res.status(200).json({
            source,
            count: events.length,
            events,
            message: source === "cache"
                ? "Wildfire retrieved from cache (may be slightly stale)."
                : "Recent Wildfire fetched and stored successfully.",
            cachedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};
export const getLiveWildFires = async (_, res, next) => {
    try {
        const { source, events } = await getWildfireData();
        if (!events?.length) {
            return res.status(204).json({ message: "No recent Wildfire found." });
        }

        res.status(200).json({
            source,
            count: events.length,
            events,
            message: source === "cache"
                ? "Wildfire retrieved from cache (may be slightly stale)."
                : "Recent Wildfire fetched and stored successfully.",
            cachedAt: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};
