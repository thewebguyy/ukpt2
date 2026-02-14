/**
 * Express Email API Server - Brevo integration
 * Handles transactional and marketing emails
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import emailRoutes from './routes/email.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    'https://customisemeuk.com',
    'https://www.customisemeuk.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

app.use(helmet());
app.use(express.json({ limit: '100kb' }));

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);

app.use('/api/email', emailRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'email-api' });
});

app.use((err, req, res, next) => {
    console.error('[Server] Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`[Email API] Server running on port ${PORT}`);
    if (!process.env.BREVO_API_KEY) {
        console.warn('[Email API] WARNING: BREVO_API_KEY is not set. Emails will fail.');
    }
});
