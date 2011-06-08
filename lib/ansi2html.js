(function(){
  function export(module_name, exports) {
    if (module) module.exports = exports
    else window[module_name] = exports
  }

  function ansi2html(str) {
    var props = {}
      , open = false

    var stylemap =
      { bold: "font-weight"
      , underline: "text-decoration"
      , color: "color"
      }

    function style() {
      var key, val, style = []
      for (var key in props) {
        val = props[key]
        if (!val) continue
        if (val == true) {
          style.push(stylemap[key] + ':' + key)
        } else {
          style.push(stylemap[key] + ':' + val)
        }
      }
      return style.join(';')
    }


    function tag(code) {
      var i
        , tag = ''
        , n = ansi2html.table[code]

      if (open) tag += '</span>'
      open = false

      if (n) {
        for (i in n) {
          props[i] = n[i]
        }
        tag += '<span style="' + style() + '">'
        open = true
      }

      return tag

    }

    return str.replace(/\[(\d+;)?(\d+)+m/g, function(match, b1, b2) {
      var i, code, res = ''
      for (i = 1; i < arguments.length - 2; i++) {
        if (!arguments[i]) continue
        code = parseInt(arguments[i])

        res += tag(code)
      }
      return res
    })
  }
  ansi2html.table =
  { 0: null
  , 1: { bold: true }
  , 3: { italic: true }
  , 4: { underline: true }
  , 30: { color: 'black' }
  , 31: { color: 'red' }
  , 32: { color: 'green' }
  , 33: { color: 'yellow' }
  , 34: { color: 'blue' }
  , 35: { color: 'magenta' }
  , 36: { color: 'cyan' }
  , 37: { color: 'white' }
  , 39: { color: null }
  }

  export('ansi2html', ansi2html)
})()

