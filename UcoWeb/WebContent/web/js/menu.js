$(document).ready(function(){
	
	var closedDeck = false;
	$('#options').hide();

	function initMenu(){
		initGames();
		initScores();
		initOptions();
		showGames();
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
		
	};
	
	function showGames(game){
		hideTools();
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
	}
	
	function openGame(game){
		
		showTools();
		
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
	}
	
	function showScores(){
		$( "#scores" ).animate({
		    left: "0",
		  }, 1500 );
	}
	
	function hideScores(){
		$( "#scores" ).animate({
		    left: "140%",
		  }, 1500 );
	}
	
	function showOptions(){
		$('#options').show(500);
		$( "#options" ).animate({
		    left: "0",
		  }, 1500 );
	}
	
	function hideOptions(){
		$( "#options" ).animate({
		    left: "-110%",
		  }, 1500, function(){$('#options').hide(500);} );
	}
	
	function hideTools(){
		$("#scores").css({visibility:"hidden"});
		$("#options").css({visibility:"hidden"});
		$("#button").css({visibility:"hidden"});
	}
	
	function showTools(){
		$("#scores").css({visibility:"visible"});
		$("#options").css({visibility:"visible"});
		$("#button").css({visibility:"visible"});
	}
	
	$(function(){
		$(".btn").css({
			"-moz-box-shadow":"5px 5px 5px #888",
			"-webkit-box-shadow":"5px 5px 5px #888",
			"box-shadow":"5px 5px 5px #888"
		});
		hideTools();
		$("#stage2").css({visibility:"visible"});

		initMenu();
	});
});