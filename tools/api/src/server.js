import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import pino from 'pino';
import { SpaceEraDate } from 'space-era-calendar';

// 1. Environment & Logging Configuration
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isProduction ? {} : {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  })
});

const app = express();

// 2. Security & Network Middleware
app.use(helmet());
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,OPTIONS',
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

// 3. Validation Schemas & Helpers
const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Invalid date format. Expected format: YYYY-MM-DD"
});

function parseUTCDate(dateStr) {
  const parts = dateStr.split('-').map(Number);
  const targetMs = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  const dateObj = new Date(targetMs);

  if (isNaN(targetMs)) {
    throw new Error('Invalid calendar date parameter.');
  }

  if (
    dateObj.getUTCFullYear() !== parts[0] ||
    dateObj.getUTCMonth() !== (parts[1] - 1) ||
    dateObj.getUTCDate() !== parts[2]
  ) {
    throw new Error('Invalid calendar date: Day out of bounds for month.');
  }

  return parts;
}

// 4. Routes

app.get('/', (req, res) => {
  res.json({
    system: 'Space Era Calendar REST API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      today: '/api/v1/today',
      convertCE: '/api/v1/ce/:date',
      phase1: '/api/v1/phase1/:date',
      phase2: '/api/v1/phase2/:date'
    }
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Space Era Calendar API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/today', (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const [year, month, day] = parseUTCDate(todayStr);
    const spaceEra = new SpaceEraDate(year, month - 1, day);

    res.json({
      queryDate: todayStr,
      phase1: spaceEra.toPhase1(),
      phase2: spaceEra.toPhase2()
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/ce/:date', (req, res, next) => {
  try {
    const validFormat = DateSchema.parse(req.params.date);
    const [year, month, day] = parseUTCDate(validFormat);
    const spaceEra = new SpaceEraDate(year, month - 1, day);

    res.json({
      ceDate: validFormat,
      phase1: spaceEra.toPhase1(),
      phase2: spaceEra.toPhase2()
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ status: 400, error: err.issues?.[0]?.message || 'Validation error' });
    }
    return res.status(422).json({ status: 422, error: err.message });
  }
});

app.get('/api/v1/phase1/:date', (req, res, next) => {
  try {
    const validFormat = DateSchema.parse(req.params.date);
    const [year, month, day] = parseUTCDate(validFormat);
    const spaceEra = new SpaceEraDate(year, month - 1, day);

    res.json({
      ceDate: validFormat,
      phase1: spaceEra.toPhase1()
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ status: 400, error: err.issues?.[0]?.message || 'Validation error' });
    }
    return res.status(422).json({ status: 422, error: err.message });
  }
});

app.get('/api/v1/phase2/:date', (req, res, next) => {
  try {
    const validFormat = DateSchema.parse(req.params.date);
    const [year, month, day] = parseUTCDate(validFormat);
    const spaceEra = new SpaceEraDate(year, month - 1, day);

    res.json({
      ceDate: validFormat,
      phase2: spaceEra.toPhase2()
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ status: 400, error: err.issues?.[0]?.message || 'Validation error' });
    }
    return res.status(422).json({ status: 422, error: err.message });
  }
});

// Centralized Error Middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({
    status: 500,
    error: 'Internal Server Error',
    message: isProduction ? 'An unexpected error occurred.' : err.message
  });
});

// 5. Server Initialization & Graceful Shutdown
const server = app.listen(PORT, () => {
  logger.info(`Space Era Calendar REST API running on port ${PORT}`);
});

function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully.`);
  server.close(() => {
    logger.info('Closed out remaining HTTP connections.');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
