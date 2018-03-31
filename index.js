var express = require('express');
var app = express();
var port = 8080;

//const secrets = require('./configfiles/secrets');


app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/pagecount', function (req, res) {
  res.send('1');
});
//app.get('/secrets', function (req, res) {
//     res.send('The secrets are'+ JSON.stringify(secrets));
//  });

app.get('/env', function (req, res) {
    res.send('The env is'+ JSON.stringify(process.env));
 });  

app.listen(port, function () {
  console.log('Example app listening on port!'+8080);
});