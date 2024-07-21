import { verifyJWT } from '../utils/jwt.js';
import Author from '../models/Author.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // pull and clear user token
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send('Error, Unauthorized request')
        }

        // Decode and verify token
        const decodedToken = await verifyJWT(token);

        // Find author by id
        const author = await Author.findById(decodedToken.id).select('-password')

        if (!author) {
            return res.status(401).send('author not found')
        }

        req.author = author;

        next();

    } catch (err) {
        return res.status(401).send('Error, Unauthorized request');
    }
}

