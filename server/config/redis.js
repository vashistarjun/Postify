const Redis = require('ioredis')

let redis;

if (process.env.REDIS_URL) {
    // For cloud Redis (Render, Redis Cloud, etc.)
    redis = new Redis(process.env.REDIS_URL);
    console.log('Connecting to Redis at:', process.env.REDIS_URL.replace(/:[^:]*@/, ':***@')); // Log URL with password masked
} else {
    // For local development
    redis = new Redis({
        host: "localhost",
        port: 6379
    });
    console.log('Connecting to local Redis');
}

// Add error handling
redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

redis.on('ready', () => {
    console.log('✅ Redis is ready to receive commands');
});

module.exports = redis;