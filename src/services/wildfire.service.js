import { getCacheData, setCacheData } from "../utils/cache.js";
import { insertEvents } from "../utils/event.js";
import { fetchRecentWildfires } from "./firms.service.js";

const CACHE_KEY = "event:wildfire:live";
const CACHE_TTL = 300;

export const getWildfireData = async () => {
    const cachedData = await getCacheData(CACHE_KEY);

    if (cachedData?.length) {
        refreshWildfireCache();
        return { source: "cache", events: cachedData };
    }

    const liveData = await fetchAndStoreWildfires();
    return { source: "NASA FIRMS", events: liveData };
};

export const refreshWildfireCache = async () => {
    try {
        const liveData = await fetchRecentWildfires();
        if (liveData?.length) {
            await insertEvents(liveData);
            await setCacheData(CACHE_KEY, liveData, CACHE_TTL);
            console.log(`💾 Cache refreshed in background (${liveData.length} events)`);
        }
    } catch (err) {
        console.error("Background refresh failed:", err);
    }
};

export const fetchAndStoreWildfires = async () => {
    const liveData = await fetchRecentWildfires();
    if (liveData?.length) {
        await insertEvents(liveData);
        await setCacheData(CACHE_KEY, liveData, CACHE_TTL);
    }
    return liveData;
};