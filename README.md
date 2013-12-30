# shell-frontend

A transform stream that takes in text and emits [parsed shell
commands][shell-parse]

## Synopsis

```javascript
var test = require('tape')
var from = require('from')
var shellFrontend = require('./')

test("it works!", function (t) {
  var frontend = shellFrontend()

  var input = [
   'echo hello world',
   'echo a "Multi-line',
   'string because that\'s fun',
   'to do"',
   'exit'
  ]

  var commandCount = 3
  var continuationCount = 2

  t.plan(commandCount + continuationCount)


  process.nextTick(writeLine)

  frontend
   .on('data', function (commands) {
     t.pass("got a command")
   })
   .on('continue', function () {
     t.pass("got asked for more input")
   })
   .on('parse-error', function (err) {
     // Should be no parse error
     t.fail(err.message)
   })

  function writeLine () {
    var it = input.shift()
    if (it) {
      frontend.write(it + '\n')
      process.nextTick(writeLine)
    } else {
      frontend.end()
    }
  }
})
```

## License

MIT

[shell-parse]: https://github.com/grncdr/js-shell-parse
