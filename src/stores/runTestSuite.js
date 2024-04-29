import { describe, test } from '@jest/globals'
import assert from 'node:assert'

export function runTestSuite (store) {
  describe('ready', () => {
    test('is a defined property that returns a boolean', () => {
      assert.strictEqual(typeof store.ready, 'boolean')
    })

    test('is false before setup() is called', () => {
      assert.strictEqual(store.ready, false)
    })
  })

  describe('setup()', () => {
    test('is a defined function that accepts no arguments', () => {
      assert(store.setup)
      assert.strictEqual(typeof store.setup, 'function')
      assert.strictEqual(store.setup.length, 0)
    })

    test('sets up the store', async () => {
      await store.setup()
      assert.strictEqual(store.ready, true)
      assert.strictEqual(await store.length, 0)
    })
  })

  describe('length', () => {
    test('is a defined property that returns a number', async () => {
      assert.strictEqual(typeof await store.length, 'number')
    })

    test('returns the number of items', async () => {
      assert.strictEqual(await store.length, 0)
    })
  })

  describe('enqueue(item)', () => {
    test('is a defined function that accepts a single argument', () => {
      assert(store.enqueue)
      assert.strictEqual(typeof store.enqueue, 'function')
      assert.strictEqual(store.enqueue.length, 1)
    })

    test('returns the number of items contained', async () => {
      assert.strictEqual(await store.enqueue('a'), 1)
      assert.strictEqual(await store.enqueue('b'), 2)
      assert.strictEqual(await store.enqueue('c'), 3)
      assert.strictEqual(await store.enqueue('d'), 4)
      assert.strictEqual(await store.enqueue('e'), 5)
      assert.strictEqual(await store.enqueue('f'), 6)
      assert.strictEqual(await store.enqueue('g'), 7)
      assert.strictEqual(await store.enqueue('h'), 8)
      assert.strictEqual(await store.enqueue('i'), 9)
      assert.strictEqual(await store.enqueue('j'), 10)
    })
  })

  describe('dequeue(length)', () => {
    test('is a defined function that accepts a single argument', () => {
      assert(store.dequeue)
      assert.strictEqual(typeof store.dequeue, 'function')
      assert.strictEqual(store.dequeue.length, 1)
    })

    test('returns items in FIFO order', async () => {
      assert.deepStrictEqual(await store.dequeue(1), ['a'])
    })

    test('returns the specified number of items', async () => {
      assert.deepStrictEqual(await store.dequeue(2), ['b', 'c'])
    })

    test('leaves excess items', async () => {
      assert.strictEqual(await store.length, 7)
    })

    test('returns all the items if less than the specified number', async () => {
      assert(await store.length < 10)
      assert.deepStrictEqual(await store.dequeue(10), ['d', 'e', 'f', 'g', 'h', 'i', 'j'])
      assert.strictEqual(await store.length, 0)
    })
  })

  describe('destroy()', () => {
    test('is a defined function that accepts no arguments', () => {
      assert(store.destroy)
      assert.strictEqual(typeof store.destroy, 'function')
      assert.strictEqual(store.destroy.length, 0)
    })

    test('destroys the store', async () => {
      await store.destroy()
      assert.strictEqual(store.ready, false)
    })
  })
}
