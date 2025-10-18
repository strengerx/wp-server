import Event from "../models/Event.js";

/**
 * Create a new event
 */
export const createEvent = async (data) => {
    const event = new Event(data);
    return await event.save();
};

/**
 * Bulk insert events (e.g. from NASA FIRMS or USGS feed)
 */
export const bulkInsertEvents = async (events) => {
    if (!Array.isArray(events)) throw new Error("Events must be an array");
    const ops = events.map((ev) => ({
        updateOne: {
            filter: {
                "coords.coordinates": ev.coords.coordinates,
                eventDate: ev.eventDate,
                type: ev.type,
            },
            update: { $setOnInsert: ev },
            upsert: true,
        },
    }));

    return await Event.bulkWrite(ops, { ordered: false });
};


/**
 * Get all events with optional filters
 */
export const getEvents = async (filters = {}, limit = 100) => {
    const query = {};

    if (filters.type) query.type = filters.type;
    if (filters.country) query.country = filters.country;
    if (filters.region) query.region = filters.region;
    if (filters.verified !== undefined) query.verified = filters.verified;

    // Time window filtering
    if (filters.startDate && filters.endDate) {
        query.eventDate = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
        };
    }

    return await Event.find(query).sort({ eventDate: -1 }).limit(limit);
};

/**
 * Get event by ID
 */
export const getEventById = async (id) => {
    return await Event.findById(id);
};

/**
 * Update event
 */
export const updateEvent = async (id, updates) => {
    return await Event.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * Delete event
 */
export const deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id);
};

/**
 * Get recent events (last 24h, for live feed)
 */
export const getRecentEvents = async () => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await Event.find({ eventDate: { $gte: since } }).sort({ eventDate: -1 });
};

/**
 * Get event history (for replay)
 */
export const getEventHistory = async (start, end) => {
    if (!start || !end) throw new Error("Start and End dates are required");
    return await Event.find({
        eventDate: { $gte: new Date(start), $lte: new Date(end) },
    }).sort({ eventDate: 1 });
};

/**
 * Geo Query — find events near a location
 */
export const getEventsNear = async (longitude, latitude, radiusKm = 100) => {
    return await Event.find({
        coords: {
            $nearSphere: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: radiusKm * 1000, // meters
            },
        },
    });
};

/**
 * Aggregate statistics (per type or severity)
 */
export const getEventStats = async (groupBy = "type") => {
    return await Event.aggregate([
        { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
};
