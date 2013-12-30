var parser = require('./frontend')()
var from = require('from')

prompt('$ ')

process.stdin.pipe(parser)
  .on('data', function (commands) {
    console.log(JSON.stringify(commands, null, 2))
    prompt('$ ')
  })
  .on('continue', function () {
    prompt('> ')
  })
  .on('parse-error', reportParseError)

function reportParseError (err, line) {
  console.error("" + err)
  var start = Math.max(0, err.offset - 8)
  console.error('  ' + line.slice(start, start + 10).trim())
  var arrow = ''
  for (var i = 0; i < (err.column - start); i++) arrow += '-';
  arrow += '^'
  console.error(arrow)
  prompt('$ ')
}

function prompt (p) {
  process.stdout.write(p)
}
