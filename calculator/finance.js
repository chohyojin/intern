
	const fs = require('fs'); //파일 입출력
	const csv = require('fast-csv'); //csv 파일 읽기위함
	const express = require('express'); //node.js express 사용
	const app = express();
	const multer = require('multer'); //Only one file upload
	const formidable = require('formidable'); //multiple file upload
	const multiparty = require('multiparty');
	const util = require('util');
	const fs_extra = require('fs-extra');
	var total_sum = 0; //총매출 변수
	var total_expense = 0; //총비용 변수
	var foreign_sum = 0; //해외총매출 변수
	var foreign_expense = 0; //해외총비용 변수
	var expectation_vat = 0; //예상부가세 변수
	
	app.set('view engine', 'ejs'); //ejs 템플릿 엔진 사용
	
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


		app.listen(8080); //포트 8080
		console.log('server 8080 connection success');

	}
	









	function calc() {

		
		app.get('/', function(req , res) { 

			res.render('upload', {//upload.ejs 파일 웹에 띄우기

			});
		});
		app.listen(8000); //포트 8000
		console.log('server 8000 connection success');
		app.post('/', function(req , res) {
			var form = new formidable.IncomingForm();
			form.multiples = true;
			form.parse(req, function(err , files) {
				//console.log(files);
			})

			form.on('end' , function(files){ 
				console.log("총 업로드 파일 갯수 == " , this.openedFiles.length);
				
				for(var i = 0; i < this.openedFiles.length; i++) {
					var stream = fs.createReadStream(this.openedFiles[i].path);
					var temp_path = this.openedFiles[i].path;
					var file_name = this.openedFiles[i].name;
					var new_location = './files';
					console.log("임시 주소 : " , temp_path);
					console.log("파일 이름 : " , file_name);

					//총매출
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
					fs_extra.move(temp_path , new_location + file_name, function(err){

					});

					//총비용
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

					});

				}
				setTimeout(function(){res.render('results' , {total_sum : total_sum.toLocaleString('en'), total_expense : total_expense.toLocaleString('en'), foreign_sum : foreign_sum.toLocaleString('en'), foreign_expense : foreign_expense.toLocaleString('en'), expectation_vat : expectation_vat.toLocaleString('en')});	 }, 7000)
				
			});
			
		});
	}
		
		
    	

		
	
	
	//모듈
	
	exports.calc = calc;
	exports.csvcalc = csvcalc; //모듈화