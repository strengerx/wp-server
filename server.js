import server from "./src/app.js";
import connectDB from "./src/configs/db.js";
import { SERVER_PORT } from "./src/configs/env.js";

(async () => {
    try {
        await connectDB();
        server.listen(SERVER_PORT, "0.0.0.0",
            () => {
                console.log(`server is running on: http://localhost:${SERVER_PORT}`);
            })
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
})();