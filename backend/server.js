import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import session from 'express-session';
import passport from './config/passportConfig.js';
// Routes
import authRoutes from './routes/authRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
// Middlewares
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from './middlewares/errorHandlers.js';

// .env
dotenv.config();

const app = express();

// App - Global Middlewares
app.use(cors());
app.use(express.json());

// Session configuration
app.use(
  session({
    // use session_secret to validate cookie session 
    secret: process.env.SESSION_SECRET,
    // session optimizations
    resave: false,
    saveUninitialized: false
  })
);

// use passport configuration
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// App - Routes 
app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/blogPosts', blogPostRoutes);

// PORT
const PORT = process.env.PORT || 3000;

// App -  Error handling Middlewares
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// Server start info
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log('Available routes:');

  console.table(
    listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(', '),
    })),
  );
});
