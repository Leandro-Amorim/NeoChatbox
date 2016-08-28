var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var connection = mysql.createConnection({
  host      : "localhost",
  user      : "[EDITE ESSA PORRA E SALVE O VACAJAIRO]",
  password  : "[EDITE ESSA PORRA E SALVE A JORELMA]",
  database  : "mchat_db"
});

//Requisição especial para mensagens, retorna um json
function create_request_message_json(user, message) {
  return '{ "type":"post_message", "username": "' + user + '", "messageText": "' + message + '" }';
}

/*Os tipos de requisição são:
  "post_message" //Para postar mensagens
  "get_messages" //Para receber a lista de mensagens
  "PIADINHA_DO_GONZO" //Para mandar uma piada bosta no Chat
  O José de baixo vai retornar um json
*/
function create_request_json(request_type) {
  return '{ "type": "' + request_type + '" }';
}

connection.connect(function(err){
  if(!err){
    console.log("Database is connected ... nn");
  } else {
    console.log("Error connecting database ... nn")
  }
});

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

io.on('connection', function(socket) {
  socket.on('chat_data', function(data){
      var data_json = JSON.parse(data);
      var data_type = data_json.type;
      if(data_type=="post_message") {
        connection.query('INSERT INTO messages(username, message) values("' + data_json.username + '", "' + data_json.messageText + '")', function(err, rows, fields) {
          if(!err) {
            console.log("The solution is: ", rows);
          } else {
            console.log("Error while performing Query.", err);
            connection.end();
          }
        });
      io.emit('chat_data', create_request_message_json( data_json.username , data_json.messageText ));
    } else if(data_type == "get_messages") {
      //DEVOLVE OS BAGUI PRO MALUKO!
      connection.query('SELECT * FROM messages', function(err, rows){
        if(err){
          throw err;
        } else {
          console.log("Data received from DB:\n");
          console.log(rows);
          for(i = 0; i < rows.length; i++) {
            socket.emit('chat_data', create_request_message_json( rows[i].username, rows[i].message ));
          }
        }
      });
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
