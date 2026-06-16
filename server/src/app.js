const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// security headers
app.use(helmet());

// cors
app.use(cors({
  origin: env.isProd
    ? [env.clientUrl]
    : [env.clientUrl, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

// body parsing
app.use(express.json({ limit: '10mb' }));

// rate limit on all API routes
app.use('/api', apiLimiter);

// health check — Render pings this
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/actions', require('./routes/actions'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// central error handler — must be last
app.use(errorHandler);

module.exports = app;
