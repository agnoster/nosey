var ansi2html = require('../lib/ansi2html')
  , vows = require('vows')
  , assert = require('assert')

vows.describe('ansi2html').addBatch(
{ 'when loading ansi2html':
  { topic: function() { return ansi2html }
  , 'it should exist': function(it) { assert.notEqual(it, null) }
  }
, 'when encoding a string':
  { topic: function() { return ansi2html('test string') }
  , 'it should be correct': function(it) { assert.equal(it, 'test string') }
  }
}).export(module)

