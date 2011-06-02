var socket = new io.Socket()

socket.connect()
socket.on('message', function(msg) {
  var msg = msg.split(':')
    , name = msg[0]
    , status = msg[1]
  var el = document.getElementById(name)

  if (!el) {
    el = document.createElement('div')
    el.setAttribute('id', name)
    el.innerHTML = name
    document.body.appendChild(el)
  }
  el.setAttribute('class', status)
})
