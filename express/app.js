/**
 * 来源于官方的实例代码，只是为了加深印象敲一遍
 */
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world!');
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
