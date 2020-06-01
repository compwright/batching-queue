const assert = require('assert')
const EventEmitter = require('events')

class BatchingQueue extends EventEmitter {
    constructor(config = {}) {
        super()

        assert(config.store, 'config.store is required')
        this.store = config.store

        assert(config.batchSize > 0, 'config.batchSize must be > 0')
        this.batchSize = config.batchSize
    }

    enqueue(item) {
        if (!this.store.ready) {
            this.store.setup()
        }

        const newSize = this.store.enqueue(item)

        // Emit a 'drain' event every batchSize items
        if (newSize > 0 && newSize % this.batchSize === 0) {
            this.emit('drain', this.length)
        }
    }

    dequeue() {
        if (!this.store.ready) {
            this.store.setup()
        }

        return this.store.dequeue(this.batchSize)
    }

    get length() {
        if (!this.store.ready) {
            return null
        }

        return Math.ceil(this.store.length / this.batchSize)
    }
}

module.exports = BatchingQueue
