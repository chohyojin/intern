
function clickbtn() {
	//$('#result').html('');
	$.ajax ({
	  url : 'http://localhost:3000/ajax',
	  dataType : 'json',
	  type : 'POST',
	  data : {'msg':$('#msg').val()},
	  success : function(result) {        	
	  	if(result['result'] == false) {
	      $('#result').html("디비에 없습니다");             					  
			}
			else {
		    console.log(result);
	      var data = result;        		                  
				$('#result').html("user_id : " + data.user_id + '<br>' + " user_name : " + data.user_name + '<br>'+ " device : " + data.device);
			}					                   
	  }
	});
}