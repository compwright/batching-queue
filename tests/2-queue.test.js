const assert = require('assert');
const BatchingQueue = require('../src/queue');
const { MemoryStore } = require('../src/stores');

describe('BatchingQueue', () => {
  const store = new MemoryStore();

  describe('constructor(config)', () => {
    it('is a defined function that accepts a single argument', () => {
      assert(BatchingQueue.constructor);
      assert.strictEqual(typeof BatchingQueue.constructor, 'function');
      assert.strictEqual(BatchingQueue.constructor.length, 1);
    });
  });

  const queue = new BatchingQueue({ store, batchSize: 4 });

  describe('length', () => {
    it('is null when the store is not ready', () => {
      assert.strictEqual(false, store.ready);
      assert.strictEqual(null, queue.length);
    });

    it('returns the number of items when the store is ready', () => {
      store.setup();
      assert.strictEqual(0, queue.length);
    });
  });

  describe('enqueue(item)', () => {
    it('calls setup() on stores that have not been setup yet', () => {
      const store = new MemoryStore();
      const queue = new BatchingQueue({ store, batchSize: 4 });

      assert(!store.ready);
      queue.enqueue('a');
      assert(store.ready);
    });

    it('queues items one by one', () => {
      queue.enqueue('a');
    });

    it('tracks the number of waiting batches', () => {
      assert.strictEqual(1, queue.length);
    });

    it('emits an event every time a new batch is ready', (done) => {
      const expectedEventCount = 4;
      let eventCount = 0;

      queue.on('drain', () => {
        eventCount++;
        if (eventCount === expectedEventCount) {
          done();
        }
      });

      for (var i = 1; i <= 15; i++) {
        queue.enqueue(i);
      }
    });
  });

  describe('dequeue()', () => {
    it('calls setup() on stores that have not been setup yet', () => {
      const store = new MemoryStore();
      const queue = new BatchingQueue({ store, batchSize: 4 });

      assert(!store.ready);
      queue.dequeue();
      assert(store.ready);
    });

    it('dequeues jobs in batches', () => {
      assert.strictEqual(store.length, 16);
      assert.strictEqual(queue.length, 4);

      const batch = queue.dequeue();

      assert.strictEqual(queue.length, 3);
      assert.strictEqual(store.length, 12);

      assert.strictEqual(batch.length, 4);
      assert.deepStrictEqual(batch, ['a', 1, 2, 3]);
    });
  });
});
