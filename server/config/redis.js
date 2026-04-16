const Redis = require('ioredis')

let redis;

if (process.env.REDIS_URL) {
    // For cloud Redis (Render, Redis Cloud, etc.)
    redis = new Redis(process.env.REDIS_URL);
} else {
    // For local development
    redis = new Redis({
        host: "localhost",
        port: 6379
    });
}

module.exports = redis;