import axios from "axios";
import csv from "csvtojson";
import { FIRMS_VIIRS_URI } from "../configs/env.js";
import parseConfidence from "../utils/parseConfidence.js";
import { transformFireRow } from "../utils/fireTransform.js";

export const fetchRecentWildfires = async (offset = 0, limit = 100) => {
    try {
        const response = await axios.get(FIRMS_VIIRS_URI, { responseType: "text" });
        const jsonData = await csv().fromString(response.data);

        const confidentFires = jsonData
            .filter(row => {
                if (!row.latitude || !row.longitude) return false;
                const conf = parseConfidence(row.confidence);
                return conf >= 50;
            })
            .map(row => transformFireRow(row, FIRMS_VIIRS_URI));

        const sorted = confidentFires.sort((a, b) => (b.temperature ?? 0) - (a.temperature ?? 0));
        const topFires = sorted.slice(offset, offset + limit);

        if (!topFires.length) {
            console.warn("No wildfire data received from FIRMS.");
        }

        return topFires;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error fetching wildfire data:", {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                status: error.response?.status,
            });
        } else {
            console.error("Unexpected error fetching wildfire data:", error);
        }
        return [];
    }
};
