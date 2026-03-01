import express from 'express';
import passport from 'passport';

const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/admin`);
    }
);

// @desc    Identify current user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173/');
    });
});

export default router;
