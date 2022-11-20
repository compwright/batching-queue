const assert = require('assert');
const stores = require('../src/stores');

function runTestSuite (store) {
  describe('ready', () => {
    it('is a defined property that returns a boolean', () => {
      assert.strictEqual(typeof store.ready, 'boolean');
    });

    it('is false before setup() is called', () => {
      assert.strictEqual(false, store.ready);
    });
  });

  describe('setup()', () => {
    it('is a defined function that accepts no arguments', () => {
      assert(store.setup);
      assert.strictEqual(typeof store.setup, 'function');
      assert.strictEqual(store.setup.length, 0);
    });

    it('sets up the store', async () => {
      await store.setup();
      assert.strictEqual(true, store.ready);
      assert.strictEqual(0, await store.length);
    });
  });

  describe('length', () => {
    it('is a defined property that returns a number', async () => {
      assert.strictEqual(typeof await store.length, 'number');
    });

    it('returns the number of items', async () => {
      assert.strictEqual(0, await store.length);
    });
  });

  describe('enqueue(item)', () => {
    it('is a defined function that accepts a single argument', () => {
      assert(store.enqueue);
      assert.strictEqual(typeof store.enqueue, 'function');
      assert.strictEqual(store.enqueue.length, 1);
    });

    it('returns the number of items contained', async () => {
      assert.strictEqual(1, await store.enqueue('a'));
      assert.strictEqual(2, await store.enqueue('b'));
      assert.strictEqual(3, await store.enqueue('c'));
      assert.strictEqual(4, await store.enqueue('d'));
      assert.strictEqual(5, await store.enqueue('e'));
      assert.strictEqual(6, await store.enqueue('f'));
      assert.strictEqual(7, await store.enqueue('g'));
      assert.strictEqual(8, await store.enqueue('h'));
      assert.strictEqual(9, await store.enqueue('i'));
      assert.strictEqual(10, await store.enqueue('j'));
    });
  });

  describe('dequeue(length)', () => {
    it('is a defined function that accepts a single argument', () => {
      assert(store.dequeue);
      assert.strictEqual(typeof store.dequeue, 'function');
      assert.strictEqual(store.dequeue.length, 1);
    });

    it('returns items in FIFO order', async () => {
      assert.strictEqual('a', (await store.dequeue(1))[0]);
    });

    it('returns the specified number of items', async () => {
      assert.deepStrictEqual(['b', 'c'], await store.dequeue(2));
    });

    it('leaves excess items', async () => {
      assert.strictEqual(await store.length, 7);
    });

    it('returns all the items if less than the specified number', async () => {
      assert(await store.length < 10);
      assert.deepStrictEqual(['d', 'e', 'f', 'g', 'h', 'i', 'j'], await store.dequeue(10));
      assert.strictEqual(await store.length, 0);
    });
  });

  describe('destroy()', () => {
    it('is a defined function that accepts no arguments', () => {
      assert(store.destroy);
      assert.strictEqual(typeof store.destroy, 'function');
      assert.strictEqual(store.destroy.length, 0);
    });

    it('destroys the store', async () => {
      await store.destroy();
      assert.strictEqual(false, store.ready);
    });
  });
}

function testRedisStore (Store, redisClient) {
  redisClient.on('error', (error) => {
    throw error;
  });

  describe('name', () => {
    it('accepts a queue name', () => {
      const store = new Store({ name: 'test', redisClient });
      assert.deepStrictEqual(store.name, 'test');
    });
  });

  runTestSuite(new Store({ name: 'test', redisClient }));

  after((done) => {
    redisClient.quit(done);
  });
}

for (const Store of Object.values(stores)) {
  describe(Store.name, () => {
    if (Store.name === 'RedisStore') {
      testRedisStore(Store, require('redis').createClient());
    } else if (Store.name === 'IoredisStore') {
      const Redis = require('ioredis');
      testRedisStore(Store, new Redis());
    } else {
      runTestSuite(new Store());
    }
  });
}
