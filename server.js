
/**
* Connecting modules of nodde.js
*/  
var express = require('express'),
    app = express(),
    restify = require('restify'),
    taskSave = require('save')('task'),
    server = restify.createServer({ name: 'my-api' });



server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


/**
* Returns all tasks
*/
server.get('/task', function (req, res, next) {
  taskSave.find({}, function (error, tasks) {
    res.send(tasks)
  })
});

/**
* Returns  task by id
*/
server.get('/task/:id', function (req, res, next) {
  taskSave.findOne({ _id: req.params.id }, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    if (task) {
      res.send(task)
    } else {
      res.send(404)
    }
  })
});

/**
* Creates a new task with paramenters task, name, _id
*/
server.post('/task', function (req, res, next) {    
    taskSave.create(req.params, function (error, task) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send(201, task)
    })
});

/**
* Updata status of  task by id
*/
server.put('/task', function (req, res, next) {
    taskSave.update( req.params, function (error, task) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
            res.send(200, task);
    });
});

/**
*Delete  task by id
*/
server.del('/task', function (req, res, next) {
    taskSave.delete( req.params._id, function (error, task) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send()
      })
});

/**
*Get all fikes.
*/
app.use(express.static(__dirname));

/**
*Run servers
*/
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})
app.listen(5000);










