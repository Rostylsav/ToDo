var restify = require('restify'),
    taskSave = require('save')('task'),
    server = restify.createServer({ name: 'my-api' })

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


server.get('/task', function (req, res, next) {
  taskSave.find({}, function (error, tasks) {
    res.send(tasks)
  })
})

server.get('/task/:id', function (req, res, next) {
  taskSave.findOne({ _id: req.params.id }, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    if (task) {
      res.send(task)
    } else {
      res.send(404)
    }
  })
})

server.post('/task', function (req, res, next) {
  if (req.params.name === undefined) {
    return next(new restify.InvalidArgumentError('Name must be supplied'))
  }

  taskSave.create({ name: req.params.name }, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send(201, task)
  })
})

server.put('/task/:id', function (req, res, next) {
  if (req.params.name === undefined) {
        return next(new restify.InvalidArgumentError('Name must be supplied'))
  }

  taskSave.update({ _id: req.params.id, name: req.params.name }, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send(200)
  })
})

server.del('/task/:id', function (req, res, next) {
  taskSave.delete(req.params.id, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send()
  })
})









var express = require('express');
var app = express();

var appServer = function(req, res, next)
{
    next();
}

app.use(appServer);
app.use(express.static(__dirname));
app.listen(5000);










