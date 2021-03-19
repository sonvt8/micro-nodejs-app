const keys = require('./keys');
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
  const result = [0, 1];

  for (let i = 2; i <= index; i++) {
    const a = result[i - 1];
    const b = result[i - 2];

    result.push(a + b);
  }

  return result[index];
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');