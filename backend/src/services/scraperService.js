import crypto from 'crypto';
import Event from '../models/Event.js';

export const generateDataHash = (title, dateTime, venueName, description) => {
    return crypto
        .createHash('sha256')
        .update(`${title}|${dateTime}|${venueName}|${description}`)
        .digest('hex');
};

export const upsertEvent = async (eventData) => {
    try {
        const { title, dateTime, venueName, originalUrl, description } = eventData;
        const incomingHash = generateDataHash(title, dateTime, venueName, description);

        const existingEvent = await Event.findOne({ originalUrl });

        if (!existingEvent) {
            // New Event
            console.log(`[Scraper] Generating New Event: ${title}`);
            await Event.create({
                ...eventData,
                dataHash: incomingHash,
                status: 'new'
            });
            return 'created';
        }

        if (existingEvent.dataHash === incomingHash) {
            // Exact match, no change detected. Just touch the timestamp.
            existingEvent.lastScrapedAt = Date.now();
            await existingEvent.save();
            return 'untouched';
        }

        // Updated Event
        console.log(`[Scraper] Updating Event: ${title}`);

        // We update fields that could have changed. (In a real scenario, compare specifically).
        existingEvent.title = title;
        existingEvent.dateTime = dateTime;
        existingEvent.venueName = venueName;
        existingEvent.description = description;
        existingEvent.dataHash = incomingHash;
        existingEvent.status = 'updated';
        existingEvent.lastScrapedAt = Date.now();

        await existingEvent.save();
        return 'updated';

    } catch (error) {
        console.error(`Error Upserting Event ${eventData.title}:`, error.message);
        throw error;
    }
};
