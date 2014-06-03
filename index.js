var extract = require('glsl-extract')
var through = require('through')

module.exports = getExports

//This is a horrible hack to make streams run synchronously
function getExports(source) {
  var exports
  var stream = through()
  var nextTick = process.nextTick
  var stack = []
  process.nextTick = function(f) {
    stack.push(f)
  }

  extract(stream)(function onExtractComplete(err, info) {
    if(err) {
      throw err
    }
    exports = info
  })

  stream.end(source)

  for(var i=0; i<stack.length; ++i) {
    var f = stack[i]
    try {
      f()
    } catch(e) {
      console.error(e)
    }
  }
  process.nextTick = nextTick
  return exports
}
