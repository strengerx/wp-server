import { connect } from "mongoose";
import { DB_URI } from "./env.js";

export default async function connectDB() {
    try {
        const conn = await connect(DB_URI);
        console.log(`✅ Database connected: ${conn.connection.name}`);
    } catch (error) {
        console.error("Error connecting to DB: " + error.message);
        process.exit(1);
    }
}