import puppeteer from 'puppeteer';

/**
 * Scrapes Eventbrite for events in a specified city.
 * @param {string} city - The city to search for events (e.g., 'sydney').
 * @returns {Promise<Array>} - Array of scraped event objects.
 */
export const scrapeEventbrite = async (city = 'sydney') => {
    console.log(`[Eventbrite Scraper] Starting scrape for ${city}...`);
    const events = [];

    // Launch Puppeteer with stealth-like settings
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--window-size=1920,1080'
        ]
    });

    try {
        const page = await browser.newPage();

        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Bypass webdriver detection to an extent
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        const searchUrl = `https://www.eventbrite.com/d/australia--${city.toLowerCase()}/all-events/`;
        console.log(`[Eventbrite Scraper] Navigating to ${searchUrl}`);

        // Go to the search page, waiting for the DOM to be largely loaded
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for the main event listing container to appear
        // Note: Eventbrite dom selectors change frequently; these are representations.
        await page.waitForSelector('main', { timeout: 15000 });

        // Scroll down multiple times to trigger lazy-loading of more event cards
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
        }

        // Extract event details
        const scrapedData = await page.evaluate((cityParam) => {
            const results = [];

            // On the new Eventbrite layout, cards are often wrapped in generic link containers
            const links = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('/e/'));

            const processedUrls = new Set();

            links.forEach(link => {
                try {
                    let originalUrl = link.href.split('?')[0];
                    if (processedUrls.has(originalUrl)) return;

                    // The title is typically in an h3
                    const pNode = link.parentNode ? link.parentNode : link;
                    const h3 = link.querySelector('h3') || pNode.querySelector('h3');
                    if (!h3) return;

                    const title = h3.innerText.trim();
                    if (title.length < 5) return;

                    // The whole text representation usually contains Date & Venue
                    const container = link.closest('div[class*="Stack_root"]') || link.closest('div');
                    let rawText = container ? container.innerText : link.innerText;

                    const parts = rawText.split('\n').map(p => p.trim()).filter(p => p.length > 0);

                    let dateString = null;
                    let venueName = 'Sydney (TBA)';

                    for (let p of parts) {
                        if (p !== title && p !== 'Going fast' && p !== 'Almost full') {
                            if (p.includes(' PM') || p.includes(' AM') || p.match(/(Today|Tomorrow|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Jan |Feb |Mar |Apr |May |Jun |Jul |Aug |Sep |Oct |Nov |Dec )/i)) {
                                if (!dateString) dateString = p;
                            } else if (p.length > 3 && p.length < 50 && !p.includes('$')) {
                                venueName = p;
                            }
                        }
                    }

                    // Fallback date if none found
                    if (!dateString && parts.length > 1 && parts[1] !== title) {
                        dateString = parts[1];
                    }

                    // Image extraction
                    let imageUrl = null;
                    const imgNode = link.querySelector('img');
                    if (imgNode) {
                        imageUrl = imgNode.src;
                    }

                    processedUrls.add(originalUrl);

                    results.push({
                        title,
                        originalUrl,
                        dateString: dateString || new Date().toISOString(),
                        venueName: venueName || 'Sydney',
                        imageUrl,
                        sourceWebsite: 'Eventbrite'
                    });

                } catch (e) {
                    // Ignore card errors
                }
            });

            return results;
        }, city);

        // Post-processing mapped data
        for (const rawEvent of scrapedData) {
            // Simple heuristic date parsing (In a real app, use Day.js or Date-fns with NLP parsing)
            const parsedDate = new Date(rawEvent.dateString);
            let finalDate = !isNaN(parsedDate.getTime()) ? parsedDate : new Date(); // Fallback to current date if parse fails

            // Add to our final array modeled against our Mongoose schema
            events.push({
                title: rawEvent.title,
                dateTime: finalDate,
                venueName: rawEvent.venueName,
                city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
                description: 'Description not provided on listing page. Scraped from Eventbrite.', // Often requires navigating to the detail page
                imageUrl: rawEvent.imageUrl,
                originalUrl: rawEvent.originalUrl,
                sourceWebsite: rawEvent.sourceWebsite
            });
        }

        console.log(`[Eventbrite Scraper] Successfully scraped ${events.length} events.`);

    } catch (error) {
        console.error('[Eventbrite Scraper] Error during scraping:', error.message);
    } finally {
        await browser.close();
    }

    return events;
};
