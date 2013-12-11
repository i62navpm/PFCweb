$(document).ready(function(){

	function RegisterUser(){
		$("#registerButton").click($.proxy(this, "registerClick"));
		$("#registerName").focusout($.proxy(this, "focusOutName"));
		$("#registerAdress").focusout($.proxy(this, "focusOutAdress"));
		$("#registerEmail").focusout($.proxy(this, "focusOutEmail"));
		$("#registerPassword").focusout($.proxy(this, "focusOutPassword"));
	}
	
	RegisterUser.prototype.focusOutName = function(){
		if(this.validName()){
			$('#error').hide(500);
        	$("#formRegisterName.form-group").removeClass("has-error");
        	$("#formRegisterName.form-group").addClass("has-success");
		}
	};
	
	RegisterUser.prototype.focusOutAdress = function(){
		if(this.validAdress()){
        	$('#error').hide(500);
			$("#formRegisterAdress.form-group").removeClass("has-error");
	    	$("#formRegisterAdress.form-group").addClass("has-success");
		}
	};
	
	RegisterUser.prototype.focusOutEmail = function(){
		if(this.validEmail()){
			$('#error').hide(500);
        	$("#formRegisterEmail.form-group").removeClass("has-error");
        	$("#formRegisterEmail.form-group").addClass("has-success");
		}
	};
	
	RegisterUser.prototype.focusOutPassword = function(){
		if(this.validPassword()){
        	$('#error').hide(500);
			$("#formRegisterPassword.form-group").removeClass("has-error");
	    	$("#formRegisterPassword.form-group").addClass("has-success");
		}
	};
	
	RegisterUser.prototype.registerClick = function(){
		if (this.validForm()){
			var formData = {
					name: $("#registerName").val(),
					adress: $("#registerAdress").val(),
					email: $("#registerEmail").val(),
					password: CryptoJS.SHA3($("#registerPassword").val()).toString(CryptoJS.enc.Hex)
			};
			$.ajax({
			    url : "http://localhost:8080/UcoWeb/RegisterUser",
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
			}).done($.proxy(this, "responseRegisterUser"));
		}
	};
	
	RegisterUser.prototype.responseRegisterUser = function(){
		console.log(response);
		if (response){
			console.log("verdadero");
			$("#inputEmail").val($("#registerEmail").val());
			$("#inputPassword").val($("#registerPassword").val());
			objIndex.enterClick();
		}
		else{
			$("#registerEmail").focus();
	        $("#formRegisterEmail.form-group").addClass("has-error");
			$("#errorText").text("La cuenta de correo ya existe.");
			$('#error').show(500);
		}
	};
	
	RegisterUser.prototype.validForm = function(){
		if (!this.validName())
			return false;
		else if (!this.validAdress())
			return false;
		else if (!this.validEmail())
			return false;
		else if (!this.validPassword())
			return false;
		return true;
	};
	
	RegisterUser.prototype.validName = function(){
		var name = $("#registerName").val();
		if(name == ""){
	        $("#registerName").focus();
	        $("#formRegisterName.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir un nombre.");
			$('#error').show(500);
	        return false;
	    }
		return true;
	};
	
	RegisterUser.prototype.validAdress = function(){
		var adress = $("#registerAdress").val();
		if(adress == ""){
	        $("#registerAdress").focus();
	        $("#formRegisterAdress.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una dirección.");
			$('#error').show(500);
	        return false;
	    }
		return true;
	};
	
	RegisterUser.prototype.validEmail = function(){
		var email = $("#registerEmail").val();
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(email == ""){
	        $("#registerEmail").focus();
	        $("#formRegisterEmail.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una cuenta de correo.");
			$('#error').show(500);
	        return false;
	    }
		else if (!re.test(email)){
			$("#registerEmail").focus();
			$("#formRegisterEmail.form-group").addClass("has-error");
	        $("#errorText").text("El correo introducido no es correcto.");
	   		$('#error').show(500);
	        return false;
	    }
	    return true;
	};
	
	RegisterUser.prototype.validPassword = function(){
		var password = $("#registerPassword").val();
		$("#error").removeClass("alert-warning");
		$("#error").addClass("alert-danger");
		
		if(password == ""){
	        $("#registerPassword").focus();
	        $("#formRegisterPassword.form-group").addClass("has-error");
	        $("#errorText").text("Debe introducir una contraseña.");
	        $('#error').show(500);
	        return false;
	    }
		else if (password.length<=6){
			$("#registerPassword").focus();
			$("#formRegisterPassword.form-group").addClass("has-error");
	        
			$("#error").removeClass("alert-danger");
			$("#error").addClass("alert-warning");
			$("#errorText").text("Introduzca una contraseña de más de 6 caracteres.");
			$('#error').show(500);
	        return false;
	    }
	    return true;
	};
	
	$(function(){
		aux = new RegisterUser();
	});
});