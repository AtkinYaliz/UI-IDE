/*
 * utils
 */
const { promisify } = require('util');
client.get = promisify(client.get);
const blogs = await client.get(123);


/*
 * Mongo
 */
// query is type of Query. Mongoose queries are not promises.
const Person = mongoose.model('Person', yourSchema);
const query = Person
  .find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  })
  .limit(10)
  .skip(20)
  .sort({ occupation: -1 })
  .select({ name: 1, occupation: 1 });
const query = Person
  .find({ occupation: /host/ })
  .where('name.last').equals('Ghost')
  .where('age').gt(17).lt(66)
  .where('likes').in(['vaporizing', 'talking'])
  .limit(10)
  .skip(20)
  .sort('-occupation')
  .select('name occupation');

query.exec((err, result) => console.log(result));
query.then(result => console.log(result));
const result = await query;


/*
 * Redis
 */
const redis = require('redis');
const {promisify} = require("util");

const client = redis.createClient('redis://127.0.0.1:6379');
client.get = promisify(client.get);
client.set = promisify(client.set);
client.hget = promisify(client.hget);
client.hset = promisify(client.hset);
client.hgetall = promisify(client.hgetall);

async function get(key) {
  return await client.get(key);
}
async function set(key, value, ex) {
  return await client.set(key, value, ...(ex ? ['EX', ex] : []))
}
async function hget(hash, key) {
  return await client.hget(hash, key)
}
async function hgetAll(hash) {
  // returns an object
  return await client.hgetall(hash)
}
async function hset(hash, key, value, ex) {
  return await client.hset(hash, key, value, ...(ex ? ['EX', ex] : []));
}
async function del(key) {
  // can delete both get and hget
  await client.del(key)
}
async function hdel(hash, key) {
  await client.hdel(hash, key)
}
