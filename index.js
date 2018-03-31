// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular

var express = require('express');
var app = express();
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var port = 8080;


/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});
*/
// healthcheck
app.get('/pagecount', function (req, res) {
  res.send('1');
});


app.get('/env', function (req, res) {
  res.send('The env is' + JSON.stringify(process.env));
});
var dbservice = process.env.DATABASE_SERVICE_NAME;
var user = process.env.MONGODB_USER;
var pw = process.env.MONGODB_PASSWORD;
var db = process.env.MONGODB_DATABASE|| 'sampledb';
var mport = process.env.MONGODB_SERVICE_PORT||'27017';
var mhost = process.env.MONGODB_PORT_27017_TCP_ADDR||'localhost';
//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu'); // connect to mongoDB database on modulus.io
if(!user){
  mongoose.connect(`mongodb://${mhost}:${mport}/${db}`);
}else{
  mongoose.connect(`mongodb://${user}:${pw}@${mhost}:${mport}/${db}`);
}

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model =================
var Todo = mongoose.model('Todo', {
  text: String
});

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function (req, res) {

  // use mongoose to get all todos in the database
  Todo.find(function (err, todos) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err)
      res.send(err)

    res.json(todos); // return all todos in JSON format
  });
});

// create todo and send back all todos after creation
app.post('/api/todos', function (req, res) {

  // create a todo, information comes from AJAX request from Angular
  Todo.create({
    text: req.body.text,
    done: false
  }, function (err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function (err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });

});

// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
  Todo.remove({
    _id: req.params.todo_id
  }, function (err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function (err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(port, function () {
  console.log('Example app listening on port!' + 8080);
});