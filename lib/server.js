var express = require('express')
  , app = express.createServer()
  , io = require('socket.io')
  , socket = io.listen(app)
  , subscribers = {}
  , projects = {}

app.set('view engine', 'jade')

app.use(express.static(__dirname + '/../public'))

app.get('/', function(req, res) {
  res.render('index')
})

app.get('/cc.xml', function(req, res) {
  res.render('cc.xml.jade', { projects: nosey.projects, layout: false })
})

app.listen(3000)

function broadcast(msg) {
  var client
  console.log("BCAST: " + msg)
  for (var clientId in subscribers) {
    if (!subscribers.hasOwnProperty(clientId)) continue
    client = subscribers[clientId]
    client.send(msg)
  }
}

socket.on('connection', function(client) {
  subscribers[client.sessionId] = client
  client.on('disconnect', function() {
    delete(subscribers[client.sessionId])
  })
})

var nosey = require('../lib/nosey')
nosey.watchDirectory(process.env['HOME'] + '/.nosey/')
nosey.on('project_done', function(project) {
  broadcast(project.name + ':' + project.status)
})
