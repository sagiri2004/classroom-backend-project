const Redis = require('ioredis');

const redis = new Redis({
  host: 'singapore-redis.render.com',  // Địa chỉ Redis
  port: 6379,                          // Cổng Redis
  password: 'V79Ca7aFu2o26vzdWBTGjC7B0TE0Br7R',  // Mật khẩu Redis
  tls: true                            // Bật TLS để bảo vệ kết nối
});

redis.on('connect', () => {
  console.log('Connected to Redis securely via TLS');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
