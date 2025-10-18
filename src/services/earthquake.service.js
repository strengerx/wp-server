import { getCacheData, setCacheData } from "../utils/cache.js";
import { insertEvents } from "../utils/event.js";
import { fetchRecentEarthquakes } from "./usgs.service.js";

const CACHE_KEY = "event:earthquakes:live";
const CACHE_TTL = 300;

export const getEarthquakeData = async () => {
    const cachedData = await getCacheData(CACHE_KEY);

    if (cachedData?.length) {
        refreshEarthquakeCache();
        return { source: "cache", events: cachedData };
    }

    const liveData = await fetchAndStoreEarthquakes();
    return { source: "USGS", events: liveData };
};

export const refreshEarthquakeCache = async () => {
    try {
        const liveData = await fetchRecentEarthquakes();
        if (liveData?.length) {
            await insertEvents(liveData);
            await setCacheData(CACHE_KEY, liveData, CACHE_TTL);
            console.log(`💾 Cache refreshed in background (${liveData.length} events)`);
        }
    } catch (err) {
        console.error("Background refresh failed:", err);
    }
};

export const fetchAndStoreEarthquakes = async () => {
    const liveData = await fetchRecentEarthquakes();
    if (liveData?.length) {
        await insertEvents(liveData);
        await setCacheData(CACHE_KEY, liveData, CACHE_TTL);
    }
    return liveData;
};
