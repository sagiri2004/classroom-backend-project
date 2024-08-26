const Redis = require('ioredis');
const redis = new Redis({
    host: '127.0.0.1', // Địa chỉ của Redis server
    port: 6379,        // Cổng của Redis server
});

module.exports = redis;