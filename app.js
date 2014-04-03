var express = require('express');
var fs = require('fs');
var app = express();

var appServer = function(req, res, next)
{
	next();
}
app.use(function(req, res, next) {
        req.rawBody = '';
        req.setEncoding('utf8');
        
        req.on('data', function(chunk) {
               req.rawBody += chunk;
               });
        
        req.on('end', function() {
               next();
               });
        });

app.use(express.bodyParser());



app.post('/app', function(req, res)
    {
        fs.writeFile('d:/rpas/GitHub/ToDo/data.txt', req.rawBody, function (err) {if (err){return console.log(err);}else{console.log('File file is saved!');}})
    });

app.use(appServer);
app.use(express.static(__dirname));
app.listen(3000);
