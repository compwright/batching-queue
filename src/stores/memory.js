import assert from 'node:assert'

export class MemoryStore {
  setup () {
    this.store = [];
  }

  destroy () {
    this.store = null;
  }

  enqueue (item) {
    assert(this.ready, 'call setup() before using this store');
    return this.store.push(item);
  }

  dequeue (batchSize) {
    assert(this.ready, 'call setup() before using this store');
    return this.store.splice(0, batchSize);
  }

  get length () {
    assert(this.ready, 'call setup() before using this store');
    return this.store.length;
  }

  get ready () {
    return Array.isArray(this.store);
  }
}
