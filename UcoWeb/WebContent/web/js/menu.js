	function UserMenu(){
		this.closedDeck = false;
		$("#button .btn").css({
			"-moz-box-shadow":"5px 5px 5px #888",
			"-webkit-box-shadow":"5px 5px 5px #888",
			"box-shadow":"5px 5px 5px #888"
		});
	};
	
	UserMenu.prototype.startMenu = function(){
		this.hideTools();
		this.initTools();
		this.initGames();
		this.initScores();
		this.showGames();
	};
	
	UserMenu.prototype.initGames = function(){
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

	UserMenu.prototype.gameClick = function() {
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
	
	UserMenu.prototype.initScores = function(){
		$('#scores').liteAccordion({
			containerWidth : $(".col-md-6").width(),
			containerHeight : "200px",
			theme: "stitch"
		});
	};
	
	UserMenu.prototype.initTools = function() {
		$("#scores").css({left:"120%"});
		$("#options").css({left:"-120%"});
		$("#button").css({left:"-120%"});
	};
	
	UserMenu.prototype.showGames = function(){
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
	
	UserMenu.prototype.openGame = function(game){
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
	
	UserMenu.prototype.showScores = function(){
		$( "#scores" ).animate({
		    left: "0",
		  }, 1500 );
	};
	
	UserMenu.prototype.hideScores = function(){
		$( "#scores" ).animate({
		    left: "140%",
		  }, 1500 );
	};
	
	UserMenu.prototype.showOptions = function(){
		$('#options').show(500);
		$( "#options" ).animate({
		    left: "0",
		  }, 1500);
	};
	
	UserMenu.prototype.hideOptions = function(){
		$( "#options" ).animate({
		    left: "-120%",
		  }, 1500, $.proxy(this,"hideAsinc"));
	};
	
	UserMenu.prototype.hideAsinc = function(){
		if(!this.closedDeck)
			$('#options').hide(500);
	};
	
	UserMenu.prototype.hideTools = function(){
		$("#scores").hide();
		$("#options").hide();
		$("#button").hide();
	};
	
	UserMenu.prototype.showTools = function(){
		$("#scores").show();
		$("#options").show();
		$("#button").show();
	};

