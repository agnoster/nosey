var socket = new io.Socket()
var projects = {}
var active = null

socket.connect()
socket.on('message', function(project) {
  var el = document.getElementById(project.name)
  if (project.status == 'DELETED') {
    console.log(project.name)
    if (active && active.id == project.name) {
      active = null
      $('#project-info').addClass('empty')
    }
    el.parentNode.removeChild(el)
    delete(projects[project.name])
    return
  }

  if (!el) {
    el = $('<div class="project"><div class="icon"></div><div class="label">' + project.name + '</div></div>')
    el[0].setAttribute('id', project.name)
    $('#projects')[0].appendChild(el[0])
  }
  el.setAttribute('data-status', project.status)
  el.setAttribute('data-running', project.running ? 'true' : '')
  projects[project.name] = project

  update_active()
})

$('.rerun').live('click', function() {
  socket.send({ rerun: [active.id] })
})


function update_active() {
  var statusmark = '✔'
  for (var path in projects) {
    if (projects[path] && projects[path].status && projects[path].status == 'err')
      statusmark = '✘'
  }

  $('#favicon').attr('href', '/images/' + (statusmark == '✔' ? 'green' : 'red') + '.png')
  document.title = statusmark + ' nosey'

  if (!active || !active.id || !projects[active.id]) return

  var project = projects[active.id]
    , run = project.running || project.last_run

  if (project.running) {
    $('.rerun').attr('disabled', 'disabled')
    $('.runstatus').html('Run started ' + (new Date(project.running.start)))
  } else {
    $('.rerun').removeAttr('disabled')
    if (run) {
      $('.runstatus').html('Last run ended ' + (new Date(run.stop)))
    } else {
      $('.runstatus').html('Not run yet')
    }
  }
  if (!run) return
  $('#stdout').html(ansi2html(run.stdout + run.stderr))
}

$('.project').live('click', function(e) {
  if (active) $(active).removeClass('active')

  $('#project-info').removeClass('empty')
  active = this
  $(this).addClass('active')
  update_active()
})

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

function load_projects(data) {
  projects = data
}
