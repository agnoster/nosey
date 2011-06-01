vows = require 'vows'
assert = require 'assert'

vows
  .describe('Test a project')
  .addBatch

    'when we ':
      topic: -> 42 / 0

      'we get infinity': (topic) ->
        assert.equal topic, Infinity

  .export module
