    var express = require('express')
    ,http = require('http')
    ,app = express()
    ,server = http.createServer(app);

    var fs = require('fs');

    app.get('/', function(req, res){
      console.log('hello world');
    });



    app.get('/get_user_info', function(req, res){
      fs.readFile("user.json",'utf8',function(error,data){


      });
    });

    app.get('/get_user_info/:username', function(req,res){
      fs.readFile("user.json",'utf8',function(error,data){


        console.log(data);
        var users = JSON.parse(data);
        console.log(users);
        res.send(users[req.params.username]);

      });
    });
    server.listen(8000, function (){
        console.log('success');
    });
