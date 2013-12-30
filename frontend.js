var through = require('through2')
var combiner = require('stream-combiner')
var map = require('array-map')
var parse = require('shell-parse')
var split = require('split')

module.exports = createStreamingParser

function createStreamingParser () {
  var input = ""
  var stream = combiner(split(),
                        through({objectMode: true},
                                parseLine,
                                errIfUnparsed))

  stream.parse = parse
  return stream

  function parseLine (line, _, cb) {
    if (!line.length) return // ignore empty input
    input = input + line + '\n'
    try {
      var commands = parse(input)
      stream.emit('input', input)
      input = ""
      this.push(commands)
    } catch (err) {
      if (isContinuation(err, input)) {
        stream.emit('continue')
      } else {
        stream.emit('parse-error', err, input)
        input = ""
      }
    }
    cb()
  }

  function errIfUnparsed (cb) {
    debugger
    cb(input ? new Error("Unparsed input: " + input) : null)
  }
}

function isContinuation (err, input) {
  try {
    parse(input.slice(err.offset), 'continuationStart')
    return true
  } catch (err) {
    return false
  }
}
