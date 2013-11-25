$(document).ready(function(){
	
	$('#sti-menu').iconmenu({
		animMouseenter	: {
			'mText' : {speed : 400, easing : 'easeOutExpo', delay : 140, dir : 1},
			'sText' : {speed : 400, easing : 'easeOutExpo', delay : 0, dir : 1},
			'icon'  : {speed : 800, easing : 'easeOutBounce', delay : 280, dir : 1}
		},
		animMouseleave	: {
			'mText' : {speed : 400, easing : 'easeInExpo', delay : 140, dir : 1},
			'sText' : {speed : 400, easing : 'easeInExpo', delay : 280, dir : 1},
			'icon'  : {speed : 400, easing : 'easeInExpo', delay : 0, dir : 1}
		}
	});

	
	showGames();
	
	$("#scores").css({left:"110%"});
	var baraja = $('#baraja-el').baraja();
	baraja.fan( {
		speed : 500,
		easing : 'ease-out',
		range : 90,
		direction : 'left',
		origin : { x : 75, y : 100 },
		center : true
	});
	
	$('#scores').liteAccordion({
		containerWidth : $(".col-md-5").width()-4,
		containerHeight : $("#baraja").height()-4,
		theme: "stitch"
		
	});
	
	var closedDeck = false;
	
	$("#baraja-el").click(function() {
		var target = $( event.target );
		game = target.parent().attr("id");
		closedDeck = !closedDeck;
		if (closedDeck){
			openGame(game);
			showScores();
		}
		else{
			showGames();
			hideScores();
		}
	});
	
	function openGame(game){
		$("#baraja").animate({
		    left: "0"
		  }, 1500 );
		$(".baraja-container").animate({
			height: 155,
		},1500);
		
		$(".baraja-container h4").hide();
		$(".baraja-container p").hide();
	}
	
	function showGames(game){
		$( "#baraja" ).animate({
		    left: ($(".container").width()-$(".col-md-7").width())/2,
		  }, 1500 );
		$(".baraja-container").animate({
			height: 310,
		},0);
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
		    left: "110%",
		  }, 1500 );
	}
	
});