import rateLimit from 'express-rate-limit';

// LIMIT TO 100 REQUESTS IN A DAY
export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: 'You have exceeded the allowed 100 requests in 24 hrs', 
  standardHeaders: true,
  legacyHeaders: false,
});