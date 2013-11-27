$(document).ready(function(){
	
	var closedDeck = false;
	
	function initMenu(){
		initGames();
		initScores();
		initOptions();
		$(".container").css({visibility:"visible"});
		console.log("camon");
		showGames();
	};
	
	function initGames(){
		$("#scores").css({left:"120%"});
		var baraja = $('#baraja-el').baraja();
		baraja.fan( {
			speed : 500,
			easing : 'ease-out',
			range : 90,
			direction : 'left',
			origin : { x : 75, y : 100 },
			center : true
		});
		
		$("#button").css({left:"-120%"});
	};
	
	function initScores(){
		$('#scores').liteAccordion({
			containerWidth : $(".col-md-6").width(),
			containerHeight : "200px",
			theme: "stitch"
		});
	}
	
	function initOptions() {
		$("#options").css("left", "-110%");
		$('#sti-menu').iconmenu({
			animMouseenter	: {
				'mText' : {speed : 500, easing : 'easeOutExpo', delay : 200, dir : -1},
				'sText' : {speed : 500, easing : 'easeOutExpo', delay : 200, dir : -1},
				'icon'  : {speed : 700, easing : 'easeOutBounce', delay : 0, dir : 1}
			},
			animMouseleave	: {
				'mText' : {speed : 400, easing : 'easeInExpo', delay : 0, dir : -1},
				'sText' : {speed : 400, easing : 'easeInExpo', delay : 0, dir : 1},
				'icon'  : {speed : 400, easing : 'easeInExpo', delay : 0, dir : -1}
			}
		});
	};
	
	$("#baraja-el").click(function() {
		var target = $( event.target );
		game = target.parent().attr("id");
		closedDeck = !closedDeck;
		if (closedDeck){
			openGame(game);
			showScores();
			showOptions();
		}
		else{
			showGames();
			hideScores();
			hideOptions();
		}
	});
	
	function openGame(game){
		$("#baraja").animate({
		    left: "0"
		  }, 1500 );
		$(".baraja-container").animate({
			height: $(".baraja-container").height()/2,
		},1500);
		
		$("#button").animate({
			left: "0",
		},1500);
		
		$(".baraja-container h4").hide();
		$(".baraja-container p").hide();
	}
	
	function showGames(game){
		$( "#baraja" ).animate({
		    left: ($(".container").width()-$(".col-md-6").width())/2,
		  }, 1500 );
		$(".baraja-container").animate({
			height: 310,
		},0);
		$("#button").animate({
			left: "-120%",
		},1500);
		$(".baraja-container h4").show();
		$(".baraja-container p").show();
	}
	
	function showScores(){
		$( "#scores" ).animate({
		    left: "0",
		  }, 1500 );
	}
	
	function hideScores(){
		$( "#scores" ).animate({
		    left: "120%",
		  }, 1500 );
	}
	
	function showOptions(){
		$( "#options" ).animate({
		    left: "0",
		  }, 1500 );
	}
	
	function hideOptions(){
		$( "#options" ).animate({
		    left: "-110%",
		  }, 1500 );
	}
	
	$(function(){
	    initMenu();
	});
});