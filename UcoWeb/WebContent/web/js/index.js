$(document).ready(function(){
	var response = null;
	function initIndex(){
		
		
		$('#error').hide();
		initGallery();
		
		$( "#enter" ).click(function() {
			if (validEmail() && validPassword()){
				var formData = {
						email: $("#inputEmail").val(),
						password: $("#inputPassword").val()
				};
				
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
					$("#userName").html(response["user"] +"<b class='caret'></b>");
					showUserId();
					changePage();
					//document.body.innerHTML= response["body"];
					//console.log(response["scripts"]);
					
					//$(".container").html(response["body"]);
				});
	
			}
		});
	}
	
	function showUserId(){
		$("#userReg").animate({
		    left: "50%",
		  }, 1000 );
		$("#userId").animate({
		    left: "35%",
		  }, 1000);
	}
	function hideUserId(){
		$("#userReg").animate({
		    left: "0",
		  }, 1000 );
		$("#userId").animate({
		    left: "50%",
		  }, 1000);
	}
	
	function loadjscssfile(filename, filetype){
		var fileref = undefined;
		if (filetype=="js"){
			fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
		}
		else if (filetype=="css"){
			fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (typeof fileref!="undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref);
	}
	
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
	
	function initGallery(){
		$(".box_skitter_large").skitter({
			theme: 'round',
			dots: true, 
			preview: true,
			hideTools: true,
			numbers_align: 'center',
			
		});
		
		$(".box_skitter_large").height($("#register").height());
		$(".box_skitter").height($(".box_skitter_large").height());
		$(".container_skitter").height($(".box_skitter_large").height());
	}
	
	function changePage(){
		//window.history.pushState({"html":document.html,"pageTitle":document.pageTitle},"", "www.myadmin.com");
		$(".container").animate({
		    left: "-120%",
		  }, 1000, changeContainer);
	}
	
	function changeContainer(){
		$(".container").css({left: "120%"});
		for(aux in response["scripts"])
			loadjscssfile(response["scripts"][aux], 'js');
		for(aux in response["links"])
			loadjscssfile(response["links"][aux], 'css');
		$(".container").html(response["body"]);
		$(".container").animate({
		    left: "0",
		  }, 1000);	
		
	}
	function showContainer(){
		$(".container").animate({
		    left: "0",
		  }, 1000);
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
	
	$(function(){
	    initIndex();
	});
});