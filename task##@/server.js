


     var express = require('express');
     var app = express();
     var fs = require('fs');





     app.set('view engine', 'ejs');


     app.get('/', function(req, res){
        var drinks = [
            { name: 'mary, drunkness : 3'},
            { name: 'mary2, drunkness : 13'},
            { name: 'mary3, drunkness : 23'},
        ];
        var tagline = "Any code of your own that you";
        res.render('pages/index', {
          drinks : drinks,
          tagline: tagline
        });
      });



     app.get('/get_user_info/user_id=1', function(req,res){
        var info = [
        { a: 'user_id :', user_id : '1'},
        {b: 'user_name : ',user_name : '박성준'},
        {c: 'device : ', device : 'Android'}


     	];

     res.render('pages/index2',{
        info : info

      });
     });

     app.get('/get_user_info/user_id=2', function(req,res){
        var info = [
        {a: 'user_id :', user_id : '2'},
        {b: 'user_name : ',user_name : '주용재'},
        {c: 'device : ', device : 'IPhone'}


     	];

     res.render('pages/index2',{
        info : info

      });
     });





     app.get('/get_user_info', function(req, res){
        var user_id = req.query.user_id;
        
          if(user_id == 1){
        	  
        	   fs.readFile('user.js', 'utf8', function(error, data){
                var obj = JSON.parse(data);
                //console.log(obj[String(user_id)]);
                //var numberobj = new Number(user_id);
                //console.log(numberobj);
                res.render("pages/index2", {
                obj : obj[String(user_id)]
                });
             });
        	   
        			
       	  }

          else if(user_id == 2){
        	  
       	    	fs.readFile('user.js', 'utf8', function(error, data){
                var obj = JSON.parse(data);
                res.render("pages/index2", {
                obj : obj[String(user_id)]
                });
      		 
      	   });
          }
          else {
          	
            
               
       		  res.render("pages/index3", {
       		     user_id : user_id
       		  });
      	  } 

      });




     app.get('/about', function(req, res){
        res.render('pages/about');
      });

     app.listen(8000);
     console.log('server connection success');











