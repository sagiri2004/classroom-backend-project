require('dotenv').config();
const Redis = require('ioredis');

//redis://red-cs7uei88fa8c73cn48kg:6379
const redis = new Redis("rediss://red-cs7uei88fa8c73cn48kg:5BzvcXbgU5ORm26EZ7Ldr90KfrYBjbJz@singapore-redis.render.com:6379");

module.exports = redis;
