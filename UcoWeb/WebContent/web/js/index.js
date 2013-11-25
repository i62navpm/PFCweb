$(document).ready(function(){

	$('#error').hide();
	$( "#enter" ).click(function() {
		if (validEmail() && validPassword()){
			toggleContent();
			
			var formData = {
					email: $("#inputEmail").val(),
					password: $("#inputPassword").val()
			};
			var response = null;
			$.ajax({
			    url : "http://localhost:8080/UcoWeb/User",
			    type: "POST",
			    data: formData,
			    dataType: "json",
			    success: function(data, textStatus, jqXHR)
			    {
			        response = data;
			    },
			    error: function (jqXHR, textStatus, errorThrown)
			    {
			    	response = textStatus;
			    }
			}).done(function( msg ) {
				console.log(response);}
			);

		}
	});
	
	$( "#inputEmail" ).focusout(function() {
		if(validEmail()){
			$('#error').hide(500);
        	$("#enterEmail.form-group").removeClass("has-error");
        	$("#enterEmail.form-group").addClass("has-success");
		}
		});
	$( "#inputPassword" ).focusout(function() {
		if(validPassword()){
        	$('#error').hide(500);
			$("#enterPassword.form-group").removeClass("has-error");
	    	$("#enterPassword.form-group").addClass("has-success");
		}
		});
	
	function toggleContent(){
		$("#leftDiv").animate({
		    left: "-120%",
		  }, 1000 );
		$("#rightDiv").animate({
			left: "-120%",
		  }, 1000 );
	}
	
	function validEmail(){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
		if($("#inputEmail").val() == ""){
	        $("#inputEmail").focus();
	        $("#enterEmail.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una cuenta de correo.");
    		$('#error').show(500);
	        
	        /*if(!$('#error').hasClass('in') )
	        	$("#error").collapse('toggle');*/
	        return false;
	    }
		else if (!re.test($("#inputEmail").val())){
			$("#inputEmail").focus();
			$("#enterEmail.form-group").addClass("has-error");
	        $("#errorText").text("El correo introducido no es correcto.");
       		$('#error').show(500);
	        return false;
	    }
	    return true;
	}
	
	function validPassword(){
		$("#error").removeClass("alert-warning");
		$("#error").addClass("alert-danger");
		
		if($("#inputPassword").val() == ""){
	        $("#inputPassword").focus();
	        $("#enterPassword.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una contraseña.");
	        $('#error').show(500);
	        return false;
	    }
		else if ($("#inputPassword").val().length<=6){
			$("#inputPassword").focus();
			$("#enterPassword.form-group").addClass("has-error");
	        
			$("#error").removeClass("alert-danger");
			$("#error").addClass("alert-warning");
			$("#errorText").text("Introduzca una contraseña de más de 6 carácteres.");
			$('#error').show(500);
	        return false;
	    }
	    return true;
	}
});