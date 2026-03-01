import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// @desc    Submit email for "GET TICKETS" action
// @route   POST /api/leads
// @access  Public
router.post('/', async (req, res) => {
    const { email, consent, eventId, eventUrl } = req.body;

    if (!email || consent !== true) {
        return res.status(400).json({ message: 'Valid email and consent are required.' });
    }

    try {
        const lead = await Lead.create({
            email,
            consent,
            eventId: eventId || null,
            eventUrl: eventUrl || null
        });

        res.status(201).json(lead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error saving lead' });
    }
});

export default router;
