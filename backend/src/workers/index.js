import { Worker, Queue } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { upsertEvent } from '../services/scraperService.js';

dotenv.config();

// Initialize DB before starting workers
connectDB();

const connection = new Redis(process.env.REDIS_URI || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null
});

// Create Queue to add repeatable jobs
export const scraperQueue = new Queue('scrape-jobs', { connection });

// Define Worker
const worker = new Worker('scrape-jobs', async job => {
    console.log(`[Worker] Started processing job: ${job.name} (City: ${job.data.city})`);

    try {
        if (job.name === 'scrape-eventbrite') {
            // Mocked implementation: Here you would call your Puppeteer/Cheerio scripts.
            const mockScrapedEvent = {
                title: 'Tech Meetup Sydney',
                dateTime: new Date(Date.now() + 86400000), // Tomorrow
                venueName: 'Sydney Convention Centre',
                city: 'Sydney',
                description: 'An amazing gathering of React developers.',
                originalUrl: 'https://mock.com/event/' + Math.random(),
                sourceWebsite: 'Eventbrite Mock'
            };

            const result = await upsertEvent(mockScrapedEvent);
            console.log(`[Worker] Upsert returned: ${result}`);
        }
    } catch (error) {
        console.error(`[Worker] Error processing job ${job.id}:`, error);
        throw error;
    }

}, { connection });

worker.on('completed', job => {
    console.log(`[Worker] Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
    console.log(`[Worker] Job failed: ${job.id} with error: ${err.message}`);
});

// Setup Initial Cron Jobs
export const setupCronJobs = async () => {
    // Clear old repeatable jobs
    const maxJobs = await scraperQueue.getRepeatableJobs();
    for (const job of maxJobs) {
        await scraperQueue.removeRepeatableByKey(job.key);
    }

    // Add job running every 6 hours
    await scraperQueue.add('scrape-eventbrite', { city: 'Sydney' }, {
        repeat: {
            pattern: '0 */6 * * *'
        }
    });

    console.log('[Worker] Cron jobs scheduled.');
};

// If run directly (node src/workers/index.js)
if (process.argv[1].endsWith('worker/index.js') || process.argv[1].endsWith('workers\\index.js')) {
    setupCronJobs();
}
