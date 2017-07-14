var express = require('express');
var router = express.Router();
var fs = require('fs');

/* POST 호출 처리 */
router.post('/', function(req, res, next) {
  fs.readFile('user.js','utf8',function(error, data) {
		var obj = JSON.parse(data);
		//console.log(obj);
    	var msg = req.body.msg;
    	
    	try {
    		if (msg == obj[msg].user_id) {
    		   res.json( obj[msg]);
    	    }
    	} catch (exception) {
    		res.json({result:false});
    	}
    	fs = 1;
    	//res.send({result:true, msg:obj[msg].user_id, msg2:obj[msg].user_name});	
	});
});


module.exports = router;
