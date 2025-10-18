import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import eRouter from "./routes/usgs.routes.js";
import wfRouter from "./routes/firms.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.get("/", (_, res) => {
    res.status(200).json({ message: "🌍 WorldPulse API Running" });
});

app.use("/api/events/earthquakes", eRouter);
app.use("/api/events/wildfire", wfRouter);

const server = http.createServer(app);
export default server;
