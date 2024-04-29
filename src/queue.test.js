import assert from 'node:assert'
import { describe, test } from '@jest/globals'

import { BatchingQueue } from './queue.js'
import { MemoryStore } from '../src/stores'

describe('BatchingQueue', () => {
  const store = new MemoryStore()

  describe('constructor(config)', () => {
    test('is a defined function that accepts a single argument', () => {
      assert(BatchingQueue.constructor)
      assert.strictEqual(typeof BatchingQueue.constructor, 'function')
      assert.strictEqual(BatchingQueue.constructor.length, 1)
    })
  })

  const queue = new BatchingQueue({ store, batchSize: 4 })

  describe('length', () => {
    test('is null when the store is not ready', () => {
      assert.strictEqual(false, store.ready)
      assert.strictEqual(null, queue.length)
    })

    test('returns the number of items when the store is ready', async () => {
      await store.setup()
      assert.strictEqual(0, await queue.length)
    })
  })

  describe('enqueue(item)', () => {
    test('calls setup() on stores that have not been setup yet', async () => {
      const store = new MemoryStore()
      const queue = new BatchingQueue({ store, batchSize: 4 })

      assert(!store.ready)
      await queue.enqueue('a')
      assert(store.ready)
    })

    test('queues items one by one', async () => {
      await queue.enqueue('a')
    })

    test('tracks the number of waiting batches', async () => {
      assert.strictEqual(1, await queue.length)
    })

    test('emits an event every time a new batch is ready', async () => {
      const expectedEventCount = 4
      const events = []

      queue.on('drain', e => events.push(e))

      let j = 0
      for (let i = 1; i <= 15; i++) {
        const eventEmitted = await queue.enqueue(i)
        if (eventEmitted === true) {
          j++
        }
      }

      assert.strictEqual(events.length, expectedEventCount)
      assert.strictEqual(j, expectedEventCount)
    })
  })

  describe('dequeue()', () => {
    test('calls setup() on stores that have not been setup yet', async () => {
      const store = new MemoryStore()
      const queue = new BatchingQueue({ store, batchSize: 4 })

      assert(!store.ready)
      await queue.dequeue()
      assert(store.ready)
    })

    test('dequeues jobs in batches', async () => {
      assert.strictEqual(await store.length, 16)
      assert.strictEqual(await queue.length, 4)

      const batch = await queue.dequeue()

      assert.strictEqual(await queue.length, 3)
      assert.strictEqual(await store.length, 12)

      assert.strictEqual(batch.length, 4)
      assert.deepStrictEqual(batch, ['a', 1, 2, 3])
    })
  })
})
