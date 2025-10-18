import parseConfidence from "./parseConfidence.js";

export const SEVERITY_LEVELS = {
    severe: 50,
    moderate: 20,
};

export const CONFIDENCE_THRESHOLD = 50;
export const VERIFIED_THRESHOLD = 80;

export const transformFireRow = (row, sourceUrl) => {
    const latitude = parseFloat(row.latitude);
    const longitude = parseFloat(row.longitude);
    const temperature = parseFloat(row.bright_ti4) || null;
    const intensity = parseFloat(row.frp) || null;
    const confidence = parseConfidence(row.confidence);
    const date = row.acq_date;
    const time = (row.acq_time || "").padStart(4, "0");
    const hour = time.slice(0, 2);
    const minute = time.slice(2);
    const daynight = row.daynight === "D" ? "Day" : "Night";

    return {
        type: "wildfire",
        title: `Wildfire at ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        description: `Detected by ${row.satellite} (${row.instrument}) during ${daynight} pass.`,
        coords: { type: "Point", coordinates: [longitude, latitude] },
        temperature,
        intensity,
        confidence,
        source: "NASA FIRMS",
        source_url: sourceUrl,
        verified: confidence >= VERIFIED_THRESHOLD,
        severity:
            intensity >= SEVERITY_LEVELS.severe
                ? "severe"
                : intensity >= SEVERITY_LEVELS.moderate
                    ? "moderate"
                    : "minor",
        eventDate: new Date(`${date}T${hour}:${minute}:00Z`) || new Date(),
    };
};
