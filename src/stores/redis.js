const assert = require('assert');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);

class RedisStore {
  constructor (config = {}) {
    const { name, redisClient } = config;

    this.name = name || nanoid();


    this.client = redisClient;
    this.isReady = false;
  }

  async setup () {
    this.isReady = true;
  }

  async destroy () {
    await this.client.unlink(this.name);
    this.isReady = false;
  }

  async enqueue (item) {
    assert(this.ready, 'call setup() before using this store');
    assert.notStrictEqual(typeof item, 'null', 'null values are not allowed');
    return this.client.lpush(this.name, JSON.stringify(item));
  }

  async dequeue (batchSize) {
    assert(this.ready, 'call setup() before using this store');

    // Create a new list to temporarily hold the batch
    const batchId = this.name + '-' + nanoid();

    // Pop the required number of items off the queue and onto the batch
    const batch = await new Promise((resolve, reject) => {
      const cmds = (new Array(batchSize)).fill(['rpoplpush', this.name, batchId]);
      this.client.batch(cmds).exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    // Trim null values from the end, if any
    if (batch.indexOf(null) > -1) {
      batch.splice(batch.indexOf(null));
    }

    await this.client.unlink(batchId);

    return batch.map(item => JSON.parse(item));
  }

  get length () {
    assert(this.ready, 'call setup() before using this store');
    return this.client.llen(this.name);
  }

  get ready () {
    return this.isReady;
  }
}

module.exports = RedisStore;
