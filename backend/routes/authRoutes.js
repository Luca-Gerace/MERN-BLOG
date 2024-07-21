import express from 'express';
import Author from '../models/Author.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express();

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

export default router;