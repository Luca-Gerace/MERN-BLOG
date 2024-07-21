import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Author from '../models/Author.js';
import dotenv from 'dotenv';

dotenv.config();

// Strategy configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        },
        // Run function after a successful auth request
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Search author in mongoDB by googleid
                let author = await Author.findOne({ googleId: profile.id })

                // Create new author if not exist yet
                if (!author) {
                    author = new Author({
                        googleId: profile.id,
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    })
                }

                // Save author on MongoDb
                await author.save();

                // Pass author to passport middleware without error
                done(null, author);

            } catch (err) {
                console.error(err);
                // Pass error to passport middleware
                done(err, null);
            }
        }
    )
);

// Serialization - save user id into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization - find user id from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Author.findById(id);
        // Pass user to passport middleware without error
        done(null, user);
    } catch (err) {
        // Pass error to passport middleware
        done(err, null);
    }
})

export default passport;