	const fs = require("fs");
	const csv = require("fast-csv");
	const stream = fs.createReadStream("test.csv");
	var sum = 0;
	var	foreignsum = 0;
	csv.fromStream(stream, {headers : true })
	.validate(function(data){
		
		return data["pay type"] == 'jpn';
	})
	.on("data-invlid", function(data){
		console.log("hi");
	})
	.on("data", function(data){
		console.log(data);
		
		foreignsum = foreignsum +  (parseInt(data.number)+parseInt(data.pay));
		
	})
	.on("end", function(){
		console.log(foreignsum);

	});

	csv.fromStream(stream, {headers : true })

	.on("data-invlid", function(data){
		console.log("hi");
	})
	.on("data", function(data){
		console.log(data);
		sum = sum +  (parseInt(data.number)+parseInt(data.pay));
		
	})
	.on("end", function(){
		console.log(sum);
		console.log((sum-foreignsum)*0.065);
	});

