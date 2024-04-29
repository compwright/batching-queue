import { describe } from '@jest/globals'
import { AsyncMemoryStore } from './async-memory'
import { runTestSuite } from './runTestSuite'

describe('AsyncMemoryStore', () => {
  runTestSuite(new AsyncMemoryStore())
})
