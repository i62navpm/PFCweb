$(document).ready(function(){
	
	function Index(){
		$("#error").hide();
		$("#userId").hide();
		//$("#inputEmail").focusout($.proxy(this, "focusOutEmail"));
		//$("#inputPassword").focusout($.proxy(this, "focusOutPassword"));
		
		
		//Para borrar
		$('#playButton').prop('disabled', true);
		$("#baraja-el").click($.proxy(this, "gameClick"));
		this.closedDeck = false;
		this.baraja = $('#baraja-el').baraja();
		this.baraja.fan( {
			speed : 500,
			easing : 'ease-out',
			range : 90,
			direction : 'left',
			origin : { x : 75, y : 100 },
			center : true
		});
		
		//this.menu = new UserMenu();	
		//this.modifyDialog = new ModifyUser();
	}
	
	//Borrar este método
	Index.prototype.gameClick = function(event) {
		var target = $( event.target );
		var game = target.parent().attr("id");
		
		this.closedDeck = !this.closedDeck;
		
		if(this.closedDeck){	
			this.openGame(game);
			$('#playButton').prop('disabled', false);
		}
		else
			$('#playButton').prop('disabled', true);
	};
	//Borrar este método
	Index.prototype.openGame = function(game){
		if (game=="pong")
			$("#playButton").attr("onclick", "window.location.href='pong.html'");
		else if(game=="tetris")
			$("#playButton").attr("onclick", "window.location.href='tetris.html'");
		else if(game=="dragMe")
			$("#playButton").attr("onclick", "window.location.href='dragMe.html'");
		
	};
	
	Index.prototype.focusOutEmail = function(){
		if(this.validEmail()){
			$('#error').hide(500);
        	$("#enterEmail.form-group").removeClass("has-error");
        	$("#enterEmail.form-group").addClass("has-success");
		}
	};
	
	Index.prototype.focusOutPassword = function(){
		if(this.validPassword()){
        	$('#error').hide(500);
			$("#enterPassword.form-group").removeClass("has-error");
	    	$("#enterPassword.form-group").addClass("has-success");
		}
	};
	
	Index.prototype.checkSession = function(){
		var formData = {
				subject: "signIn",
		};
		$.ajax({
		    url : "http://localhost:8080/UcoWeb/Session",
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
		}).done($.proxy(this, "responseCheckSession"));
	};
	
	Index.prototype.responseCheckSession = function(){
		console.log(response["user"]);
		response["user"]["_id"] = response["id"];
		if(!response["user"])
			this.initIndex();
		else{
			$("#userName").html(response["user"]["name"] +"<b class='caret'></b>");
			this.modifyDialog.setModifyDialog(response["user"]);
			this.showMenuInm();
		}
	};
	
	Index.prototype.initIndex = function(){
		$("#stage1").css({visibility:"visible"});
		this.initGallery();
		$("#enter").click($.proxy(this, "enterClick"));
			
	};
	
	Index.prototype.enterClick = function(){
		if (this.validEmail() && this.validPassword()){
			var formData = {
					email: $("#inputEmail").val(),
					password: CryptoJS.SHA3($("#inputPassword").val()).toString(CryptoJS.enc.Hex) 
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
			}).done($.proxy(this, "responseInitIndex"));
		}
	};
	
	Index.prototype.responseInitIndex = function(){
		if (response["user"]){
			$("#userName").html(response["user"]["name"] +"<b class='caret'></b>");
			response["user"]["_id"] = response["id"];
			this.modifyDialog.setModifyDialog(response["user"]);
			this.showUserId();
			this.showMenu();
		}else{
			$("#inputEmail").focus();
	        $("#enterEmail.form-group").addClass("has-error");
	        $("#errorText").text("Los datos de acceso no son correctos.");
    		$('#error').show(500);	
		}
	};
	
	Index.prototype.exitWeb = function(){
		var formData = {
				subject: "logOut",
		};
		$.ajax({
		    url : "http://localhost:8080/UcoWeb/Session",
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
		}).done($.proxy(this, "responseLogOutSession"));
	};
	
	Index.prototype.responseLogOutSession = function(){
		this.hideUserId();
		this.showIndex();
		
	};
	
	Index.prototype.showUserId = function(){
		$("#exit").click($.proxy(this, "exitWeb"));
		$("#userReg").animate({
		    left: "100%",
		  }, 1000, function(){$("#userReg").hide();
		  					  $("#userId").show();
		  				  	  $("#userId").animate({
		  						 left: "0",
		  					 	}, 1000);
		  });
	};
	
	Index.prototype.hideUserId = function(){
		$("#userId").animate({
		    left: "100%",
		  }, 1000, function(){$("#userId").hide();
			  				  $("#userReg").show();
			  				  $("#userReg").animate({
			  				    left: "0",
			  				  }, 1000 );
		  });
	};
	
	Index.prototype.initGallery = function(){
		$(".box_skitter_large").css({width: $(".col-md-7").width(), height: $(".col-md-7").height()}).skitter({
			theme: 'round',
			dots: true, 
			preview: true,
			hideTools: true,
			numbers_align: 'center',
			
		});
	};
	
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
	
   Index.prototype.showMenu = function(){
		//Problema de Unique URL: http://ajaxpatterns.org/Unique_URLs

		$("#stage2").html(response["body"]);
		this.menu.startMenu();
		
		$("#stage1").animate({
		    left: "-60%",
		  },1000);
		$("#stage2").animate({
		    left: "-50%",
		  },1000);
	};
	
	Index.prototype.showMenuInm = function(){
		this.showUserId();
		$("#stage1").css({left: "-60%"});
		$("#stage2").css({left: "-50%"});
		$("#stage2").html(response["body"]);
		this.menu.startMenu();
	};
	
	
//	  $(window).bind("popstate", function(e) {
//		  alert("hola");
//		   });
		 
	
	Index.prototype.showIndex = function(){
		this.initIndex();
		//window.history.pushState({"html":document.html,"pageTitle":document.pageTitle},"", "www.myadmin.com");
		$("#stage1").animate({
		    left: "0",
		  },1000);
		$("#stage2").animate({
		    left: "0",
		  },1000);
	};
	
	Index.prototype.validEmail = function(){
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
	};
	
	Index.prototype.validPassword = function(){
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
			$("#errorText").text("Introduzca una contraseña de más de 6 caracteres.");
			$('#error').show(500);
	        return false;
	    }
	    return true;
	};
	
	$(function(){
		objIndex = new Index();
		//objIndex.checkSession();
	});
});