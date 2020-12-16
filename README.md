# batching-queue

[![Build Status](https://travis-ci.org/compwright/batching-queue.svg?branch=master)](https://travis-ci.org/compwright/batching-queue)
[![Dependency Status](https://img.shields.io/david/compwright/batching-queue.svg?style=flat-square)](https://david-dm.org/compwright/batching-queue)
[![Download Status](https://img.shields.io/npm/dm/batching-queue.svg?style=flat-square)](https://www.npmjs.com/package/batching-queue)
[![Sponsor on GitHub](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&link=https://github.com/sponsors/compwright)](https://github.com/sponsors/compwright)

A batching queue for items that need to be enqueued one by one, but dequeued in batches

* Works with multiple storage backends
* Queues items one by one
* Dequeues in batches (FIFO)
* Tracks the number of waiting items
* Emits an event when the number of waiting items reaches the batch size threshold

## Installation

```
npm install batching-queue
```

## Included Storage Backends

* MemoryStore - stores items in an array (not for production use)
* AsyncMemoryStore - same as MemoryStore, but with async methods
* RedisStore - stores items in Redis

## Example Usage

```javascript
const { BatchingQueue, MemoryStore } = require('batching-queue')

const queue = new BatchingQueue({
    store: new MemoryStore(),
    batchSize: 12
})

function drain(batchesWaiting) {
    console.log(batchesWaiting, 'batches waiting')
    for (var i = 0; i < batchesWaiting; i++) {
        const batch = queue.dequeue()
        console.log(batch)
    }
}

// drain batches every 12 items
queue.on('drain', drain)

for (var i = 0; i < 10000; i++) {
    queue.enqueue(i)
}

// drain remaining batches immediately
drain(queue.length)
```

## API

### BatchingQueue

#### constructor(config)

Config:

* `store` (require) Storage backend for the queue (see src/stores/memory.js for a reference implementation)
* `batchSize` (required) Batch size

#### enqueue(item)

Adds an item to the queue. Returns `true` if a batch is full, otherwise returns `false`.

#### dequeue()

Dequeues the first [batchSize] number of items. If there are not enough items to satisfy batchSize, all the items available will be returned.

#### length

Property reports the number of batches waiting in the queue.

> Note: if the storage backend is not initialized, this will return null.

### Storage Backend Interface

You may to implement your own storage backend to interface your database or cache. See the bundled MemoryStore or AsyncMemoryStore for a reference.

#### setup()

Initialize and set up the storage backend. Establish connections, create database collections, etc.

This will be called before calling `enqueue()` or `dequeue()` when `ready === false`.

#### destroy()

Destroy the storage backend (optional).

#### async enqueue(item)

Store an item in the queue.

The store must return the *exact* number of items in the store subsequent to the storage operation.

#### async dequeue(batchSize)

Retrieve and delete [batchSize] items from the storage backend.

Return the set of items retrieved.

#### length

Return the number of items in the store.

#### ready

Return `true` if ready and setup, otherwise, return `false`.

### RedisStore

The RedisStore class has the following additional methods:

#### constructor(config)

Config:

* `redisClient` (required) Instance of [node-redis](https://npmjs.org/package/redis)
* `name` Queue list key name, will be randomized if omitted

## License

MIT License
