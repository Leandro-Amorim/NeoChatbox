var app = require('express')();
var path = require('path');
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});