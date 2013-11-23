$(document).ready(function(){
	
	$( "#enter" ).click(function() {
		if (validEmail() && validPassword()){
			toggleContent();
			
			/*setTimeout(function(){
				$("#content").text("Ingresado.");
				toggleContent();
			}, 1000);*/
			
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
		if($('#error').hasClass('in') && validEmail()){
        	$("#error").collapse('toggle');
        	$("#enterEmail.form-group").removeClass("has-error");
        	$("#enterEmail.form-group").addClass("has-success");
		}
		});
	$( "#inputPassword" ).focusout(function() {
		if($('#error').hasClass('in')  && validPassword()){
        	$("#error").collapse('toggle');
			$("#enterPassword.form-group").removeClass("has-error");
	    	$("#enterPassword.form-group").addClass("has-success");
		}
		});
	
	function toggleContent(){
		$( "#content" ).animate({
		    height: "toggle"
		  }, 1000, function() {});
	}
	
	function validEmail(){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
		if($("#inputEmail").val() == ""){
	        $("#inputEmail").focus();
	        $("#enterEmail.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una cuenta de correo.");
	        if(!$('#error').hasClass('in') )
	        	$("#error").collapse('toggle');
	        return false;
	    }
		else if (!re.test($("#inputEmail").val())){
			$("#inputEmail").focus();
			$("#enterEmail.form-group").addClass("has-error");
	        $("#errorText").text("El correo introducido no es correcto.");
	        if(!$('#error').hasClass('in') )
	        	$("#error").collapse('toggle');
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
	        if(!$('#error').hasClass('in') )
	        	$("#error").collapse('toggle');
	        return false;
	    }
		else if ($("#inputPassword").val().length<=6){
			$("#inputPassword").focus();
			$("#enterPassword.form-group").addClass("has-error");
	        
			$("#error").removeClass("alert-danger");
			$("#error").addClass("alert-warning");
			$("#errorText").text("Introduzca una contraseña de más de 6 carácteres.");
	        if(!$('#error').hasClass('in') )
	        	$("#error").collapse('toggle');
	        
	        return false;
	    }
	    return true;
	}
});