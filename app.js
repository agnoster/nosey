var express = require('express')
  , app = express.createServer()
  , io = require('socket.io')
  , socket = io.listen(app)
  , subscribers = {}
  , projects = {}
  , stylus = require('stylus')
  , nib = require('nib')
  , _ = require('underscore')


app.use(stylus.middleware(
{ src: __dirname + '/public'
, compile: function (str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(require('nib')())
  }
}))

app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.render('index', { projects: nosey.projects })
})

app.get('/cc.xml', function(req, res) {
  res.render('cc.xml.jade', { projects: nosey.projects, layout: false })
})

app.listen(4343)

function broadcast(project) {
  var client
  for (var clientId in subscribers) {
    if (!subscribers.hasOwnProperty(clientId)) continue
    client = subscribers[clientId]
    send_project(client, project)
  }
}

function send_project(client, project) {
  var p = _.clone(project)
  delete(p.child)
  delete(p.timer)

  client.send(p)
}

socket.on('connection', function(client) {
  subscribers[client.sessionId] = client

  for (var path in nosey.projects) {
    send_project(client, nosey.projects[path])
  }

  client.on('disconnect', function() {
    delete(subscribers[client.sessionId])
  })
  client.on('message', function(msg) {
    var i, project
    if (msg.rerun) {
      for (i = 0; i < msg.rerun.length; i++) {
        project = nosey.findProject(msg.rerun[i])
        nosey.emit('run_project', project)
      }
    }
  })
})

var nosey = require('./lib/nosey')
nosey.watchDirectory(process.env['HOME'] + '/.nosey/')
nosey.on('project_done', function(project) {
  broadcast(project)
})
nosey.on('project_add', function(project) {
  console.log("PROJECT ADDED")
  console.log(project)
  broadcast(project)
})
nosey.on('project_running', function(project) {
  project.child.stdout.on('data', function(){broadcast(project)})
  broadcast(project)
})
nosey.on('project_gone', function(path, project) {
  project.status = 'DELETED'
  console.log(project)
  broadcast(project)
})
