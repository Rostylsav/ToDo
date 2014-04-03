var restify = require('restify')
  , taskSave = require('save')('task')
  , server = restify.createServer({ name: 'my-api' })

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


server.get('/task', function (req, res, next) {
  taskSave.find({}, function (tasks) {
    res.send(tasks)
  })
})

server.get('/task/:id', function (req, res, next) {
  taskSave.findOne({ _id: req.params.id }, function (task) {
    if (task) {
      res.send(task)
    } else {
      res.send(404)
    }
  })
})

server.post('/task', function (req, res, next) {
  taskSave.create({ name: req.params.name }, function (task) {
    res.send(201, task)
  })
})

server.put('/task/:id', function (req, res, next) {
  taskSave.update({ _id: req.params.id, name: req.params.name }, function () {
    res.send(200)
  })
})

server.del('/task/:id', function (req, res, next) {
  taskSave.delete(req.params.id, function () {
    res.send()
  })
})