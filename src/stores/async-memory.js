import assert from 'node:assert'

export class AsyncMemoryStore {
  async setup () {
    this.store = []
  }

  async destroy () {
    this.store = null
  }

  async enqueue (item) {
    assert(this.ready, 'call setup() before using this store')
    return this.store.push(item)
  }

  async dequeue (batchSize) {
    assert(this.ready, 'call setup() before using this store')
    return this.store.splice(0, batchSize)
  }

  get length () {
    assert(this.ready, 'call setup() before using this store')
    return Promise.resolve(this.store.length)
  }

  get ready () {
    return Array.isArray(this.store)
  }
}
