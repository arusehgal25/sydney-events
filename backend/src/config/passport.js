import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id_for_dev.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret_for_dev',
    callbackURL: '/api/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // If no admin check is enforced here, anyone can login. In a real system, you'd verify against a whitelist.
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                avatarUrl: profile.photos[0].value,
                role: 'admin' // By default making them admin for the assignment scope
            };

            user = await User.create(newUser);
            return done(null, user);

        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
