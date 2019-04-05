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
const client = redis.createClient('redis://127.0.0.1:6379');
client.flushall();

client.set('color', 'red');
client.get('color', console.log);    // null, 'red'
client.hset('hash', 'field', 'value');
client.hget('hash', 'field', console.log); // null, 'value'
client.set('color', 'red', 'EX', 5); // stores in the cache for 5 sec
