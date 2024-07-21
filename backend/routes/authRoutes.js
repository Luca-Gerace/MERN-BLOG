import express from 'express';
import Author from '../models/Author.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import passport from '../config/passportConfig.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http:localhost:5173';

const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
    try {
        // get email and password
        const { email, password } = req.body;

        // find author in MongoDb by email
        const author = await Author.findOne({ email });

        if (!author) {
            return res.status(401).json({ message: 'Not valid credentials' })
        }

        // Compare password with hashed password
        const isMatch = await author.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Not valid credentials' })
        }

        // generate token
        const token = await generateJWT({ id: author._id });

        // send token and message inside the response
        res.json({ token, message: 'Login successful' })

    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /me
router.get('/me', authMiddleware, async (req, res) => {

    const authorData = req.author.toObject();
    delete authorData.password;

    res.json(authorData)
});

// GET /google - handle google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /google/callback - callback function after google auth
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }), async (req, res) => {
    try {
        // generate jwt token
        const token = await generateJWT({ id: req.user._id });

        // redirect user with token to frontend, use token for the other requests
        res.redirect(`${FRONTEND_URL}/login?token=${token}`);

    } catch (err) {
        console.error('Token generation error', err);
        res.redirect(`${FRONTEND_URL}/login/error=auth_failed`);
    }
});

export default router;