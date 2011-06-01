var socket = new io.Socket()

socket.connect()
socket.on('message', function(msg) {
  console.log(msg)
})
