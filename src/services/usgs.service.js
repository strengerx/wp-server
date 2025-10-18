import axios from "axios";
import { USGS_EARTHQUAKE_URI } from "../configs/env.js";

export const fetchRecentEarthquakes = async () => {
    const endpoint = `${USGS_EARTHQUAKE_URI}/summary/all_hour.geojson`;

    try {
        const response = await axios.get(endpoint, {
            timeout: 10_000,
            headers: {
                Accept: "application/json",
                "User-Agent": "WorldPulse-Earthquake-Service/1.0",
            },
        });

        const { data } = response;
        if (!data?.features?.length) {
            console.warn("No earthquake data received from USGS.");
            return [];
        }

        return data.features.map(({ id, properties, geometry }) => {
            const { place, mag, time, title } = properties ?? {};
            const [longitude, latitude, depth] = geometry?.coordinates ?? [];

            return {
                type: "earthquake",
                title: title || place || "Unknown location",
                description: `Earthquake at ${place ?? "unknown area"} with magnitude ${mag ?? "N/A"}`,
                coords: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                country: null,
                region: null,
                location_name: place ?? null,

                magnitude: mag ?? null,
                depth: depth ?? null,
                intensity: null,
                temperature: null,
                area_affected: null,
                severity:
                    mag >= 7
                        ? "extreme"
                        : mag >= 6
                            ? "severe"
                            : mag >= 5
                                ? "moderate"
                                : "minor",

                source: "USGS",
                confidence: 100, // since it's from a verified source
                verified: true,

                eventDate: time ? new Date(time) : new Date(),
            };
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error fetching earthquake data:", {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                status: error.response?.status,
            });
        } else {
            console.error("Unexpected error fetching earthquake data:", error);
        }
        return [];
    }
};
