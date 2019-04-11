# Utils
```javascript
const { promisify } = require('util');
client.get = promisify(client.get);
const blogs = await client.get(123);
```

# Singleton
```javascript
class MailTransporter {
  public static getInstance(): MailTransporter {
    if (!MailTransporter.instance) {
      MailTransporter.instance = new MailTransporter();
    }
    return MailTransporter.instance;
  }
  private static instance: MailTransporter;

  // private configManagerInstance = null;
  private transporter: any = null;

  private constructor() {
    const { emailAuthPass, emailAuthUser, emailHost, emailPort } = ConfigManager.getInstance().getConfig();

    this.transporter = nodemailer.createTransport(
      smtpTransport({
        host: emailHost,
        port: emailPort
      })
    );
  }

  public async sendMail(options) {
    return this.transporter.sendMail(options);
  }
}

export default MailTransporter.getInstance();

class NodeCache {
  private cache: Map<CacheType | string, any>;

  constructor() {
    this.cache = new Map<CacheType | string, any>();
  }

  public get(key: CacheType | string): any {
    return this.cache.get(key);
  }
  public set(key: CacheType | string, value: any): void {
    this.cache.set(key, value);
  }
  // public delete(key: CacheType | string) {
  //   this.cache.delete(key);
  // }
  // public clear() {
  //   this.cache.clear();
  // }
}

export default new NodeCache();
```

# MongoDB
```javascript
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
```

# Redis
```javascript
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
```
