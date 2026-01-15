const { RateLimiterMemory } = require('rate-limiter-flexible');
const limiter = new RateLimiterMemory({
  points: Number(process.env.RATE_LIMIT_MAX || 100),
  duration: Number(process.env.RATE_LIMIT_WINDOW_MS || 60) / 1000
});

function middleware(req, res, next) {
  const key = req.ip;
  limiter.consume(key)
    .then(() => next())
    .catch(() => res.status(429).json({ error: 'Too many requests' }));
}

module.exports = middleware;
