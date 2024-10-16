require('dotenv').config();
const Redis = require('ioredis');

//redis://red-cs7uei88fa8c73cn48kg:6379
const redis = new Redis(process.env.REDIS_URL);

module.exports = redis;
