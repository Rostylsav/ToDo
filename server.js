
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
  taskSave.create({ task: req.params.task , status: req.params.status }, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send(201, task)
  })
});

/**
* Updata status of  task by id
*/
server.put('/task/:id', function (req, res, next) {
    for( item in req.context)
    {
        if(item == 'task')
        {
            taskSave.update({_id: req.params.id, task: req.params.task }, function (error, task) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
            res.send(200, task)
            });
        }
        if(item == 'status')
        {
            taskSave.update({_id: req.params.id, status: req.params.status }, function (error, task) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
            res.send(200, task)
            });
        }
    }
});


server.del('/task/:id', function (req, res, next) {
  taskSave.delete(req.params.id, function (error, task) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send()
  })
});

/**
*Delete  task by id
*/
app.use(express.static(__dirname));

/**
*Run servers
*/
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})
app.listen(5000);










