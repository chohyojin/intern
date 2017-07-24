	const fs = require('fs'); //파일 입출력
	const csv = require('fast-csv'); //csv 파일 읽기위함
	const express = require('express'); //node.js express 사용
	const app = express();
	const formidable = require('formidable'); //multiple file upload
	const fs_extra = require('fs-extra');
	var total_sum = 0; //총매출 변수
	var total_expense = 0; //총비용 변수
	var foreign_sum = 0; //해외총매출 변수
	var foreign_expense = 0; //해외총비용 변수
	var expectation_vat = 0; //예상부가세 변수
	
	app.set('view engine', 'ejs'); //ejs 템플릿 엔진 사용
	
	function calc() {
		app.get('/' , function(req , res) {  //get
			res.render('upload', { //upload.ejs 파일 웹에 띄우기
			});
		});
		app.listen(8000);
		console.log('server 8000 connection success');
		console.log('iSharingSoft Calculator Start');

		app.post('/' , function(req , res) { //post
			let form = new formidable.IncomingForm(); //formidable use
			form.multiples = true; //이거해야 여러개 넣어도 파일이 표시됨
			form.parse(req , function(files){ //읽은 파일 parsing
			});
			form.on('end' , function(files){ //parsing한 자료 처리 부분
				console.log("총 업로드 파일 갯수 : " , this.openedFiles.length + "개");
				for(var i = 0; i < this.openedFiles.length; i++) {	//업로드한 파일 수만큼 for문을 돈다			
					var stream = fs.createReadStream(this.openedFiles[i].path); //createReadStream은 sync가 없음
					var temp_path = this.openedFiles[i].path; //파일의 임시 경로
					var file_name = this.openedFiles[i].name; //파일의 이름 
					var year_filename = file_name.substring(9 , 13); //파일의 연도 추출
					var month_filename = file_name.substring(13 , 15); //파일의 월 추출 
					const new_location = './files'; //파일의 새로운 경로
					console.log("파일 이름 : " , file_name);

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
					fs_extra.move(temp_path , new_location + file_name, function(err){
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
					});
				}
				setTimeout(function(){res.render('results' , {total_sum : total_sum.toLocaleString('en') , total_expense : total_expense.toLocaleString('en') , foreign_sum : foreign_sum.toLocaleString('en') , foreign_expense : foreign_expense.toLocaleString('en') , expectation_vat : expectation_vat.toLocaleString('en') , year_filename : year_filename , month_filename : month_filename});} , 9500);				
				setTimeout(function(){total_sum = 0 , total_expense = 0 , foreign_sum = 0 , foreign_expense = 0 , expectation_vat = 0} ,11000);
				
			});			
		});
	}
	
	//모듈
	exports.calc = calc;
	