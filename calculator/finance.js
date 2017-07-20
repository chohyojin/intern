
	const fs = require("fs");
	const csv = require("fast-csv");
	const express = require('express');
	const app = express();
	const multer = require('multer');
	var total_sum = 0; //총매출 변수
	var total_expense = 0; //총비용 변수
	var foreign_sum = 0; //해외총매출 변수
	var foreign_expense = 0; //해외총비용 변수
	var expectation_vat = 0; //예상부가세 변수
	
	app.set('view engine', 'ejs');
	//csv계산 함수및 rendering 함수 
	function csvcalc() {
		app.get('/', function(req , res) { 

			res.render('upload', {//upload.ejs 파일 웹에 띄우기

			});
		});
		
		app.post('/', multer( { dest : 'tmp/uploads'} ).single('upload'), function(req , res) { // /tmp/uploads에 입력받은 파일 저장
			console.log(req.file);
			const stream = fs.createReadStream(req.file.path);


			//총매출 계산
			csv.fromStream(stream , { headers : true } )
			.validate(function(data) {
				return (data["Transaction Type"] == 'Charge'||data["Transaction Type"] == 'Charge refund'||data["Transaction Type"] == 'Tax'||data["Transaction Type"] == 'Tax refund');
			})
			.on("data-invlid" , function(data) {
			})
			.on("data" , function(data) {
				total_sum = total_sum + parseInt(data["Amount (Merchant Currency)"]);
			})
			.on("end" , function() {
				console.log("총매출 : " + total_sum);	
			});

			
			//총비용 계산
			csv.fromStream(stream , { headers : true } )
			.validate(function(data) {
				return (data["Transaction Type"] == 'Google fee'||data["Transaction Type"] == 'Google fee refund');
			})
			.on("data-invlid", function(data) {
			})
			.on("data" , function(data) {
				total_expense = total_expense + parseInt(data["Amount (Merchant Currency)"]);
			})
			.on("end" , function() {
				console.log("총비용 : " + total_expense);
			});


			//해외총매출 계산
			csv.fromStream(stream , { headers : true } )
			.validate(function(data) {
				return (data["Buyer Currency"] != 'KRW') && (data["Transaction Type"] == 'Charge'||data["Transaction Type"] == 'Charge refund'||data["Transaction Type"] == 'Tax'||data["Transaction Type"] == 'Tax refund');
			})
			.on("data-invlid" , function(data) {
				console.log("hi");
			})
			.on("data" , function(data) {
				foreign_sum = foreign_sum + parseInt(data["Amount (Merchant Currency)"]);
			})
			.on("end" , function() {
				console.log("해외총매출 : " + foreign_sum);
			});


			//해외총비용 계산
			csv.fromStream(stream , { headers : true })
			.validate(function(data) {
				return (data["Buyer Currency"] != 'KRW') && (data["Transaction Type"] == 'Google fee'||data["Transaction Type"] == 'Google fee refund');
			})
			.on("data-invlid" , function(data) {
				console.log("hi");
			})
			.on("data" , function(data) {	
				foreign_expense = foreign_expense + parseInt(data["Amount (Merchant Currency)"]);
			})
			.on("end" , function() {
				console.log("해외총비용 : " + foreign_expense);
				expectation_vat = ((total_sum - foreign_sum) - ( -total_expense - foreign_expense)) * 0.065;
				console.log("예상부가세 : " + expectation_vat);
				
				res.render('results' , {total_sum : total_sum.toLocaleString('en'), total_expense : total_expense.toLocaleString('en'), foreign_sum : foreign_sum.toLocaleString('en'), foreign_expense : foreign_expense.toLocaleString('en'), expectation_vat : expectation_vat.toLocaleString('en')});
				
			});
			
		});

		app.listen(8000);
		console.log('server 8000 connection success');
	}


	exports.csvcalc = csvcalc;

	


	