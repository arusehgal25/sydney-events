import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // Initialize Strategy

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import leadRoutes from './routes/leads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Init Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session definition (Needed for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat super secret',
    resave: false,
    saveUninitialized: false,
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

// Routes 
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth/google', authRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
