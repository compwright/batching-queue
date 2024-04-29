import { describe } from '@jest/globals'
import { MemoryStore } from './memory'
import { runTestSuite } from './runTestSuite'

describe('AsyncMemoryStore', () => {
  runTestSuite(new MemoryStore())
})
