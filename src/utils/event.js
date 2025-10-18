import { bulkInsertEvents } from "../services/event.service.js";

export const insertEvents = async (events) => {
    try {
        await bulkInsertEvents(events);
    } catch (err) {
        if (err.code === 11000) {
            console.warn("Duplicate events skipped");
        } else {
            console.error("DB insert error:", err);
        }
    }
};
