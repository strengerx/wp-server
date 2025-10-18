import redisClient from "../configs/redis.js";

/**
 * Set a value in Redis
 * @param {string} key - Redis key
 * @param {any} value - Value to store
 * @param {number} [ttl] - Optional time-to-live (in seconds)
 */
export const setCache = async (key, value, ttl = 300) => {
    try {
        await redisClient.set(key, JSON.stringify(value), { EX: ttl });
        return true;
    } catch (err) {
        console.error("Redis setCache error:", err);
        return false;
    }
};

/**
 * Get a value from Redis
 * @param {string} key - Redis key
 */
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Redis getCache error:", err);
        return null;
    }
};

/**
 * Delete a value from Redis
 * @param {string} key - Redis key
 */
export const delCache = async (key) => {
    try {
        await redisClient.del(key);
        return true;
    } catch (err) {
        console.error("Redis delCache error:", err);
        return false;
    }
};

/**
 * Clear all Redis keys (⚠️ Use with care)
 */
export const clearCache = async () => {
    try {
        await redisClient.flushAll();
        console.log("🧹 Redis cache cleared");
    } catch (err) {
        console.error("Redis clearCache error:", err);
    }
};
