import { describe, test, afterAll } from '@jest/globals'
import assert from 'node:assert'
import IoRedis from 'ioredis'
import { IoredisStore as Store } from './ioredis'
import { runTestSuite } from './runTestSuite'

const redisClient = new IoRedis('redis://127.0.0.1:6379')

redisClient.on('error', (error) => {
  throw error
})

describe('IoredisStore', () => {
  describe('name', () => {
    test('accepts a queue name', () => {
      const store = new Store({ name: 'test', redisClient })
      assert.deepStrictEqual(store.name, 'test')
    })
  })

  runTestSuite(new Store({ name: 'test', redisClient }))

  afterAll((done) => {
    redisClient.quit(done)
  })
})
