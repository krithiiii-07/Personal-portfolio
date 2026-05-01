// server.js — Portfolio backend (Express + PostgreSQL)
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { pool, initDB } = require('./db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

// CORS — only allow your frontend origin
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:5500',   // Live Server / VS Code
    'http://localhost:5500',
  ],
  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter — max 10 contact requests per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 10,
  message  : { success: false, error: 'Too many requests. Please try again later.' },
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running 🚀' });
});

// POST /api/contact — save a contact form message
app.post(
  '/api/contact',
  contactLimiter,

  // Validation rules
  body('name')
    .trim().notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters.'),
  body('email')
    .trim().isEmail().withMessage('A valid email is required.')
    .normalizeEmail(),
  body('subject')
    .trim().notEmpty().withMessage('Subject is required.')
    .isLength({ max: 200 }).withMessage('Subject must be under 200 characters.'),
  body('message')
    .trim().notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 3000 }).withMessage('Message must be 10–3000 characters.'),

  async (req, res) => {
    // Return validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, subject, message)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [name, email, subject, message]
      );

      const { id, created_at } = result.rows[0];
      console.log(`📬  New message #${id} from ${email} at ${created_at}`);

      res.status(201).json({
        success: true,
        message: "Thanks for reaching out! I'll get back to you soon.",
        id,
      });
    } catch (err) {
      console.error('DB error:', err.message);
      res.status(500).json({ success: false, error: 'Server error. Please try again.' });
    }
  }
);

// GET /api/messages — retrieve all messages (protect this in production!)
app.get('/api/messages', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('Failed to initialise database:', err.message);
    process.exit(1);
  });
