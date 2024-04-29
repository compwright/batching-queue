import assert from 'node:assert'
import crypto from 'node:crypto'

export class RedisStore {
  constructor (config = {}) {
    const { name, redisClient } = config

    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Missing or invalid queue name')
    }

    this.name = name
    this.client = redisClient
    this.isReady = false
  }

  async setup () {
    this.isReady = true
  }

  async destroy () {
    await this.client.UNLINK(this.name)
    this.isReady = false
  }

  async enqueue (item) {
    assert(this.ready, 'call setup() before using this store')
    assert.notStrictEqual(typeof item, 'null', 'null values are not allowed')
    return await this.client.LPUSH(this.name, JSON.stringify(item))
  }

  async dequeue (batchSize) {
    assert(this.ready, 'call setup() before using this store')

    // Create a new list to temporarily hold the batch
    const batchId = this.name + '-' + crypto.randomBytes(4).toString('hex')

    // Pop the required number of items off the queue and onto the batch
    let batch = this.client.MULTI()
    for (let i = 0; i < batchSize; i++) {
      batch = batch.RPOPLPUSH(this.name, batchId)
    }

    batch = await batch.exec()

    // Trim null values from the end, if any
    if (batch.indexOf(null) > -1) {
      batch.splice(batch.indexOf(null))
    }

    await this.client.UNLINK(batchId)

    return batch.map(item => JSON.parse(item))
  }

  get length () {
    assert(this.ready, 'call setup() before using this store')
    return this.client.LLEN(this.name)
  }

  get ready () {
    return this.isReady
  }
}
