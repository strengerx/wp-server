import { Schema, model } from "mongoose";

const eventSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "earthquake",
                "wildfire",
                "flood",
                "storm",
                "volcano",
                "landslide",
                "tsunami",
                "cyclone",
                "other",
            ],
        },
        title: { type: String, required: true },
        description: { type: String, required: true },

        coords: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (v) => Array.isArray(v) && v.length === 2,
                    message: "Coordinates must be [longitude, latitude]",
                },
            },
        },
        country: { type: String },
        region: { type: String },
        location_name: { type: String },

        magnitude: { type: Number }, // for earthquakes, volcanic eruptions
        intensity: { type: Number }, // e.g. fire intensity, rainfall index, etc.
        temperature: { type: Number }, // wildfires
        depth: { type: Number }, // earthquakes
        area_affected: { type: Number }, // km²
        severity: {
            type: String,
            enum: ["minor", "moderate", "severe", "extreme"],
        },

        source: { type: String, default: "manual" },
        confidence: { type: Number, min: 0, max: 100 },
        verified: { type: Boolean, default: false },

        eventDate: { type: Date, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

eventSchema.index({ coords: "2dsphere" });

const Event = model("Event", eventSchema);
export default Event;
