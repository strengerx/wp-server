import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT || 7300;
export const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/default"
export const USGS_EARTHQUAKE_URI = process.env.USGS_API_BASE_URI || "default"
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const FIRMS_VIIRS_URI = process.env.FIRMS_VIIRS_BASE_URI || "UNDEFIEND";