import { getCache, setCache } from "../services/redis.service.js";

export const getCacheData = async (key) => {
    try {
        const data = await getCache(key);
        return data || null;
    } catch (err) {
        console.error("Cache read error:", err);
        return null;
    }
};

export const setCacheData = async (key, value, ttl) => {
    try {
        await setCache(key, value, ttl);
    } catch (err) {
        console.error("Cache write error:", err);
    }
};
