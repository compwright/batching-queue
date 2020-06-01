const assert = require('assert');
const stores = require('../src/stores');

for (const Store of Object.values(stores)) {
  describe(Store.name, () => {
    const store = new Store();

    describe('ready', () => {
      it('is a defined property that returns a boolean', () => {
        assert.strictEqual(typeof store.ready, 'boolean');
      });

      it('is false until setup() is called', () => {
        assert.strictEqual(false, store.ready);
      });
    });

    describe('setup()', () => {
      it('is a defined function that accepts no arguments', () => {
        assert(store.setup);
        assert.strictEqual(typeof store.setup, 'function');
        assert.strictEqual(store.setup.length, 0);
      });

      it('sets up the store', () => {
        store.setup();
        assert.strictEqual(true, store.ready);
        assert.strictEqual(0, store.length);
      });
    });

    describe('length', () => {
      it('is a defined property that returns a number', () => {
        assert.strictEqual(typeof store.length, 'number');
      });

      it('returns the number of items', () => {
        assert.strictEqual(0, store.length);
      });
    });

    describe('enqueue(item)', () => {
      it('is a defined function that accepts a single argument', () => {
        assert(store.enqueue);
        assert.strictEqual(typeof store.enqueue, 'function');
        assert.strictEqual(store.enqueue.length, 1);
      });

      it('returns the number of items contained', () => {
        assert.strictEqual(1, store.enqueue('a'));
        assert.strictEqual(2, store.enqueue('b'));
        assert.strictEqual(3, store.enqueue('c'));
        assert.strictEqual(4, store.enqueue('d'));
        assert.strictEqual(5, store.enqueue('e'));
        assert.strictEqual(6, store.enqueue('f'));
        assert.strictEqual(7, store.enqueue('g'));
        assert.strictEqual(8, store.enqueue('h'));
        assert.strictEqual(9, store.enqueue('i'));
        assert.strictEqual(10, store.enqueue('j'));
      });
    });

    describe('dequeue(length)', () => {
      it('is a defined function that accepts a single argument', () => {
        assert(store.dequeue);
        assert.strictEqual(typeof store.dequeue, 'function');
        assert.strictEqual(store.dequeue.length, 1);
      });

      it('returns items in FIFO order', () => {
        assert.strictEqual('a', store.dequeue(1)[0]);
      });

      it('returns the specified number of items', () => {
        assert.deepStrictEqual(['b', 'c'], store.dequeue(2));
      });

      it('leaves excess items', () => {
        assert.strictEqual(store.length, 7);
      });

      it('returns all the items if less than the specified number', () => {
        assert(store.length < 10);
        assert.deepStrictEqual(['d', 'e', 'f', 'g', 'h', 'i', 'j'], store.dequeue(10));
        assert.strictEqual(store.length, 0);
      });
    });

    describe('destroy()', () => {
      it('is a defined function that accepts no arguments', () => {
        assert(store.destroy);
        assert.strictEqual(typeof store.destroy, 'function');
        assert.strictEqual(store.destroy.length, 0);
      });

      it('destroys the store', () => {
        store.destroy();
        assert.strictEqual(false, store.ready);
      });
    });
  });
}
