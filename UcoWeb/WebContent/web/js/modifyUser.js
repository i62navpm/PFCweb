	function ModifyUser(){
		$("#dialogError").hide();
		$("#modifyButton").click($.proxy(this, "modifyClick"));
		$("#modifyName").focusout($.proxy(this, "focusOutName"));
		$("#modifyAdress").focusout($.proxy(this, "focusOutAdress"));
		$("#modifyEmail").focusout($.proxy(this, "focusOutEmail"));
		$("#modifyPassword").focusout($.proxy(this, "focusOutPassword"));
		this.user = null;
	}
	
	ModifyUser.prototype.setModifyDialog = function(user){
		this.user = user;
		$("#modifyName").val(this.user["name"]);
		$("#modifyAdress").val(this.user["adress"]);
		$("#modifyEmail").val(this.user["email"]);
		$("#modifyPassword").val("");
	};
	
	ModifyUser.prototype.focusOutName = function(){
		if(this.validName()){
			this.hideError();
        	$("#formModifyName.form-group").removeClass("has-error");
        	$("#formModifyName.form-group").addClass("has-success");
		}
	};
	
	ModifyUser.prototype.focusOutAdress = function(){
		if(this.validAdress()){
			this.hideError();
			$("#formModifyAdress.form-group").removeClass("has-error");
	    	$("#formModifyAdress.form-group").addClass("has-success");
		}
	};
	
	ModifyUser.prototype.focusOutEmail = function(){
		if(this.validEmail()){
			this.hideError();
        	$("#formModifyEmail.form-group").removeClass("has-error");
        	$("#formModifyEmail.form-group").addClass("has-success");
		}
	};
	
	ModifyUser.prototype.focusOutPassword = function(){
		if(this.validPassword()){
			this.hideError();
			$("#formModifyPassword.form-group").removeClass("has-error");
	    	$("#formModifyPassword.form-group").addClass("has-success");
		}
	};
	
	ModifyUser.prototype.modifyClick = function(){
		console.log(this.user);
		var ident = this.user["_id"];
		if (this.validForm()){
			var formData = {
					id: ident, 
					name: $("#modifyName").val(),
					adress: $("#modifyAdress").val(),
					email: $("#modifyEmail").val(),
					password: CryptoJS.SHA3($("#modifyPassword").val()).toString(CryptoJS.enc.Hex)
			};
			$.ajax({
			    url : "http://localhost:8080/UcoWeb/ModifyUser",
			    type: "POST",
			    data: formData,
			    success: function(data, textStatus, jqXHR)
			    {
			        response = data;
			    },
			    error: function (jqXHR, textStatus, errorThrown)
			    {
			    	response = textStatus;
			    }
			}).done($.proxy(this, "responseModifyUser"));
		}
	};
	
	ModifyUser.prototype.responseModifyUser = function(){
		console.log(response);
		if (response){
			console.log("Modificado OK");
			$("#userName").html(response +"<b class='caret'></b>");
			$('#myModal').modal('hide');
		}
		else{
			console.log("Error al modificar");
		}
	};
	
	ModifyUser.prototype.validForm = function(){
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
	
	ModifyUser.prototype.validName = function(){
		var name = $("#modifyName").val();
		if(name == ""){
	        $("#modifyName").focus();
	        $("#formModifyName.form-group").addClass("has-error");
	        this.showError("Introduzca un nombre.");
	        return false;
	    }
		return true;
	};
	
	ModifyUser.prototype.validAdress = function(){
		var adress = $("#modifyAdress").val();
		if(adress == ""){
	        $("#modifyAdress").focus();
	        $("#formModifyAdress.form-group").addClass("has-error");
	        this.showError("Introduzca una dirección.");
	        return false;
	    }
		return true;
	};
	
	ModifyUser.prototype.validEmail = function(){
		var email = $("#modifyEmail").val();
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(email == ""){
	        $("#modifyEmail").focus();
	        $("#formModifyEmail.form-group").addClass("has-error");
	        this.showError("Introduzca un correo.");
	        return false;
	    }
		else if (!re.test(email)){
			$("#modifyEmail").focus();
			$("#formModifyEmail.form-group").addClass("has-error");
			this.showError("Introduzca un correo válido.");
	        return false;
	    }
	    return true;
	};
	
	ModifyUser.prototype.validPassword = function(){
		var password = $("#modifyPassword").val();
		$("#error").removeClass("alert-warning");
		$("#error").addClass("alert-danger");
		
		if(password == ""){
	        $("#modifyPassword").focus();
	        $("#formModifyPassword.form-group").addClass("has-error");
	        this.showError("Introduzca una contraseña.");
	        return false;
	    }
		else if (password.length<=6){
			$("#modifyPassword").focus();
			$("#formModifyPassword.form-group").addClass("has-error");
			this.showError("Introduzca una contraseña de más de 6 caracteres.");
	        return false;
	    }
	    return true;
	};
	
	ModifyUser.prototype.showError = function(msg){
		$("#dialogErrorText").text(msg);
		$("#dialogError").show(500);
	};
	
	ModifyUser.prototype.hideError = function(){
		$("#dialogError").hide(500);
	};