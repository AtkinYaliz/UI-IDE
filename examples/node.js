// utils
const { promisify } = require('util');
client.get = promisify(client.get);
const blogs = await client.get(123);


// Mongo


// Redis
const redis = require('redis');
const client = redis.createClient('redis://127.0.0.1:6379');
client.flushall();

client.set('color', 'red');
client.get('color', console.log);    // null, 'red'
client.hset('hash', 'field', 'value');
client.hget('hash', 'field', console.log); // null, 'value'
client.set('color', 'red', 'EX', 5); // stores in the cache for 5 sec
