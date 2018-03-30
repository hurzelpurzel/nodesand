var express = require('express');
var app = express();
var port = 8080;

const fs = require('fs');


app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/secrets', function (req, res) {
    var secrets =fs.readdirSync('/secrets');
    res.send('The secrets are'+ JSON.stringify(secrets));
  });

app.listen(port, function () {
  console.log('Example app listening on port!'+8080);
});