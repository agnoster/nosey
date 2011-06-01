/* central hookup */

var events = require('events')
  , nosey = new events.EventEmitter
  , fs = require('fs')
  , _ = require('underscore')
  , child_process = require('child_process')

nosey.projects = {}

nosey.watchDirectory = function(dir) {
  nosey.dir = dir
  fs.watchFile(dir, function (curr, prev) {
    if (curr.mtime.valueOf() != prev.mtime.valueOf())
      nosey.emit('touch', dir)
  })
  nosey.emit('touch', dir)
}

nosey.on('touch', function(dir) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.log(err)
      return
    }

    var i, path, old = _.clone(nosey.projects)
    for (var i = 0; i < files.length; i++) {
      path = dir + files[i]
      if (!nosey.projects.hasOwnProperty(path)) {
        nosey.emit('project_found', path, files[i])
      } else {
        delete(path)
      }
    }
    for (path in old) {
      if (!old.hasOwnProperty(path)) continue
      // left overs
      nosey.emit('project_gone', path, nosey.projects[path])
    }
  })
})

nosey.on('project_found', function(path, name) {
  var project = nosey.projects[path] = { path: path, name: name, status: 'new', interval: 60000 }
  fs.readFile(project.path + '/package.json', function (err, data) {
    if (err) {
      nosey.emit('project_add_failed', project, err)
      return
    }
    project.package = JSON.parse(data)
    nosey.emit('project_add', project)
  })
})

nosey.on('project_add', function(project) {
  nosey.emit('run_project', project)
  
})

nosey.on('run_project', function(project) {
  if (project.timer) {
    clearTimeout(project.timer)
    delete(project.timer)
  }

  var options =
    { cwd: project.path
    , env: process.env
    , customFds: [-1, -1, -1]
    , setsid: false
    }

  project.status = 'running'
  project.child = child_process.spawn('npm', ['test'], options)

  console.log('START ', project.path)

  project.child.on('exit', function(code) {
    project.running.code = code
    project.running.stop = Date.now()
    project.next_run = project.running.stop + project.interval
    project.status = code ? 'err' : 'ok'
    delete(project.child)
    nosey.emit('project_done', project)
  })

  project.running = { stdout: '', stderr: '', start: Date.now() }

  project.child.stdout.on('data', function(data) {
    project.running.stdout += data
  })
  project.child.stderr.on('data', function(data) {
    project.running.stderr += data
  })

  nosey.emit('project_running', project)
})

nosey.on('project_done', function(project) {
  console.log('done: ', project)
  if (project.last_run) {
    if (!project.last_run.code != !project.running.code) {
      // build state changed!
      nosey.emit('project_' + (project.running.code ? 'broke' : 'fixed'), project)
    }
  }
  project.last_run = project.running
  delete(project.running)

  if (!project.timer) {
    project.timer = setTimeout(function(){
      nosey.emit('run_project', project)
    }, project.next_run - Date.now())
  }
})

nosey.on('project_gone', function(path, project) {
  if (project.child) {
    project.child.kill()
  }
  if (project.timer) {
    clearTimeout(project.timer)
  }
  delete(nosey.projects[path])
  nosey.emit('project_removed', path, project)
})

module.exports = nosey
