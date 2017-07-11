  var express = require('express')
  ,http = require('http')
  ,app = express()
  ,server = http.createServer(app);

  var fs = require('fs');
  app.set('view engine', 'jade');
  app.get('/', function(req, res){
    console.log('test1');
    res.sendFile(__dirname + '/test.html');

  });



  app.get('/get_user_info', function(req, res){
    fs.readFile("user.json",'utf8',function(error,data){


    });
  });

  app.get('/get_user_info/:username', function(req,res){
    res.sendFile(__dirname + '/index.html');
  });
  server.listen(8000, function (){
      console.log('success');
  });
