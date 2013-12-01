$(document).ready(function(){
	
	function initIndex(){
		$('#error').hide();
		$("#userId").hide();
		initGallery();
		
		$( "#enter" ).click(function() {
			
			if (validEmail() && validPassword()){
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
					$("#userName").html(response["user"] +"<b class='caret'></b>");
					showUserId();
					nextPage(response);
				});
			}
		});
	}
	
	function showUserId(){
		$("#userReg").animate({
		    left: "100%",
		  }, 1000, function(){$("#userReg").hide();
		  					  $("#userId").show();
		  				  	  $("#userId").animate({
		  						 left: "0",
		  					 	}, 1000);
		  });
	}
	function hideUserId(){
		
		$("#userId").animate({
		    left: "100%",
		  }, 1000, function(){$("#userId").hide();
			  				  $("#userReg").show();
			  				  $("#userReg").animate({
			  				    left: "0",
			  				  }, 1000 );
		  });
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
	
	//Para mandar el link
		 
	window.onload = function() {
	     setInterval(pollHash, 1000);
   };
	
   var recentHash = "";
   function pollHash() {
  
     if (window.location.hash==recentHash) {
       return; // Nothing's changed since last polled.
     }
     recentHash = window.location.hash;
  
     // URL has changed, update the UI accordingly.
     if(recentHash == "")
    	 previousPage();
  
   }
	
	function nextPage(response){
		//Problema de Unique URL: http://ajaxpatterns.org/Unique_URLs

		$("#stage2").html(response["body"]);
		obj = new userMenu();
		
		$("#stage1").animate({
		    left: "-60%",
		  },1000);
		$("#stage2").animate({
		    left: "-50%",
		  },1000);
		
	}
	
	
//	  $(window).bind("popstate", function(e) {
//		  alert("hola");
//		   });
		 
	
	function previousPage(){
		console.log("yipikayei");
		//window.history.pushState({"html":document.html,"pageTitle":document.pageTitle},"", "www.myadmin.com");
		$("#stage1").animate({
		    left: "0",
		  },1000);
		$("#stage2").animate({
		    left: "0",
		  },1000);
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