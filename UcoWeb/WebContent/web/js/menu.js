	function userMenu(){
		this.closedDeck = false;
		$("#button .btn").css({
			"-moz-box-shadow":"5px 5px 5px #888",
			"-webkit-box-shadow":"5px 5px 5px #888",
			"box-shadow":"5px 5px 5px #888"
		});
		this.hideTools();
		this.initTools();
		this.initGames();
		this.initScores();
		this.showGames();
	};
	
	userMenu.prototype.gameClick = function() {
		var target = $( event.target );
		var game = target.parent().attr("id");
		this.closedDeck = !this.closedDeck;
		if (this.closedDeck){
			this.openGame(game);
			this.showScores();
			this.showOptions();
		}
		else{
			this.showGames();
			this.hideScores();
			this.hideOptions();
		}
	};
	
	userMenu.prototype.initGames = function(){
		$("#baraja-el").click($.proxy(this, "gameClick"));
		var baraja = $('#baraja-el').baraja();
		baraja.fan( {
			speed : 500,
			easing : 'ease-out',
			range : 90,
			direction : 'left',
			origin : { x : 75, y : 100 },
			center : true
		});
	};
	
	userMenu.prototype.initScores = function(){
		$('#scores').liteAccordion({
			containerWidth : $(".col-md-6").width(),
			containerHeight : "200px",
			theme: "stitch"
		});
	};
	
	userMenu.prototype.initTools = function() {
		$("#scores").css({left:"120%"});
		$("#options").css({left:"-120%"});
		$("#button").css({left:"-120%"});
	};
	
	userMenu.prototype.showGames = function(){
		$( "#baraja" ).animate({
		    left: ($("#stage2").width()-$(".col-md-6").width())/2,
		  }, 1500 );
		$(".baraja-container").animate({
			height: 310,
		},0);
		$("#button").animate({
			left: "-120%",
		},1500);
		$(".baraja-container h4").show(500);
		$(".baraja-container p").show(500);
	};
	
	userMenu.prototype.openGame = function(game){
		this.showTools();
		
		$("#baraja").animate({
		    left: "0"
		  }, 1500 );
		$(".baraja-container").animate({
			height: $(".baraja-container").height()/2,
		},1500);
		
		$("#button").animate({
			left: "0",
		},1500);
		
		$(".baraja-container h4").hide(500);
		$(".baraja-container p").hide(500);
	};
	
	userMenu.prototype.showScores = function(){
		$( "#scores" ).animate({
		    left: "0",
		  }, 1500 );
	};
	
	userMenu.prototype.hideScores = function(){
		$( "#scores" ).animate({
		    left: "140%",
		  }, 1500 );
	};
	
	userMenu.prototype.showOptions = function(){
		$('#options').show(500);
		$( "#options" ).animate({
		    left: "0",
		  }, 1500);
	};
	
	userMenu.prototype.hideOptions = function(){
		$( "#options" ).animate({
		    left: "-120%",
		  }, 1500, function(){$("#options").hide(500);});
	};
	
	userMenu.prototype.hideTools = function(){
		$("#scores").hide();
		$("#options").hide();
		$("#button").hide();
	};
	
	userMenu.prototype.showTools = function(){
		$("#scores").show();
		$("#options").show();
		$("#button").show();
	};

