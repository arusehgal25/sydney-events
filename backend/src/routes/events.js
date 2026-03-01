import express from 'express';
import Event from '../models/Event.js';
import { ensureAuth } from '../middleware/authGuard.js';

const router = express.Router();

// @desc    Get all public events (filtered by query)
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { city, search } = req.query;
        let query = {};

        if (city) {
            query.city = city;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Public only sees active or imported events, typically.
        // Let's just return what they search for simplicity.
        query.status = { $ne: 'inactive' };

        const events = await Event.find(query).sort({ dateTime: 1 }).limit(50);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get ALL events for admin (including status filter)
// @route   GET /api/events/admin
// @access  Private (Dashboard)
router.get('/admin', ensureAuth, async (req, res) => {
    try {
        const { status, city, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (city) query.city = city;
        if (search) query.$text = { $search: search };

        const events = await Event.find(query).sort({ updatedAt: -1 }).limit(100);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Import an event to the platform (Status Change)
// @route   PUT /api/events/:id/import
// @access  Private (Dashboard)
router.put('/:id/import', ensureAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = 'imported';
        event.importedAt = Date.now();
        event.importedBy = req.user._id;
        event.importNotes = req.body.notes || '';

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
