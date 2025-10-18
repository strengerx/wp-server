import { createClient } from "redis";
import { REDIS_URL } from "./env.js";

const redisClient = createClient({ url: REDIS_URL });
redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

await redisClient.connect();
export default redisClient;
