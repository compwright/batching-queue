import { describe, test, afterAll, beforeAll } from '@jest/globals'
import assert from 'node:assert'
import { createClient } from '@redis/client'
import { RedisStore as Store } from './redis'
import { runTestSuite } from './runTestSuite'

const redisClient = createClient({ url: 'redis://127.0.0.1:6379' })

redisClient.on('error', (error) => {
  throw error
})

describe('RedisStore', () => {
  beforeAll(async () => {
    await redisClient.connect()
  })

  describe('name', () => {
    test('accepts a queue name', () => {
      const store = new Store({ name: 'test', redisClient })
      assert.deepStrictEqual(store.name, 'test')
    })
  })

  runTestSuite(new Store({ name: 'test', redisClient }))

  afterAll(async () => {
    await redisClient.quit()
  })
})
