module.exports = {
  MemoryStore: require('./memory'),
  AsyncMemoryStore: require('./async-memory'),
  RedisStore: require('./redis'),
  IoredisStore: require('./ioredis')
};
