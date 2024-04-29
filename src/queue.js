import assert from 'node:assert'
import EventEmitter from 'node:events'

export class BatchingQueue extends EventEmitter {
  constructor (config = {}) {
    super()

    assert(config.store, 'config.store is required')
    this.store = config.store

    assert(config.batchSize > 0, 'config.batchSize must be > 0')
    this.batchSize = config.batchSize
  }

  async enqueue (item) {
    if (!this.store.ready) {
      await this.store.setup()
    }

    const newSize = await this.store.enqueue(item)

    // Emit a 'drain' event every batchSize items
    if (newSize > 0 && newSize % this.batchSize === 0) {
      this.emit('drain', this.length)
      return true
    } else {
      return false
    }
  }

  async dequeue () {
    if (!this.store.ready) {
      await this.store.setup()
    }

    return await this.store.dequeue(this.batchSize)
  }

  get length () {
    if (!this.store.ready) {
      return null
    }

    return Promise.resolve(this.store.length)
      .then(length => Math.ceil(length / this.batchSize))
  }
}
