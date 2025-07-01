// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from './middlewares/auth.js'; // OAuth passport config
import { syncDatabase } from './models/index.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve the folder containing sendToken.html
app.use(express.static(path.join(__dirname, 'views/google')));

// Required for Passport OAuth (even if we don't use sessions for JWT)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // secure in production
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
// app.use(passport.session()); // Only if you manage sessions (not needed with JWT)

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
  syncDatabase();
});
