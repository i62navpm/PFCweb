$(document).ready(function(){
	
	var fps = 60;
	window.requestAnimationFrame = (function(){
		return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ){
			window.setTimeout(callback, 1000 / fps);
        };
	})();
	
	var stage = null;
	var nOpponents = 4;
	var opponents = new Array();
	var player = null;
	var background = null;
	var playerColor = "red";
	var opponentColor = "blue";
	var running = false;
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: parseFloat($("#container").css("width")),
		    height: parseFloat($("#container").css("width"))
		});
		
		var backgroundLayer = new Kinetic.Layer();
		var foregroundLayer = new Kinetic.Layer();
		var playerLayer = new Kinetic.Layer();
		
		background = new Background();
		backgroundLayer.add(background.group);
		
		for (var i=0;i<nOpponents; i++){
			var size = getRandomSize();
			var pos = getRandomPos(background.squareIn, size);
			var dir = getRandomDir();
			var opponent = new Opponent(pos,size,dir);
			opponents.push(opponent);
			foregroundLayer.add(opponent.square);
		};
		
		player = new Player();
		console.log(running);
		player.square.on('dragstart', function() {
			if (running == false){
				running = true;
				animOpponents();
			}
	    });
		
		foregroundLayer.add(player.square);
		
		stage.add(backgroundLayer);
		stage.add(foregroundLayer);
		stage.add(playerLayer);
		
	}
	
	function Player(){
		this.square = new Kinetic.Rect({
            fill: playerColor,
            x : stage.getWidth()/2-25,
            y : stage.getHeight()/2-25,
            width: 50,
            height: 50,
            stroke: 'black',
			strokeWidth: 4,
			cornerRadius: 5,
            draggable: true,
            dragBoundFunc: function(pos) {
            	if (pos.y < 40 || pos.y > stage.getHeight()-110)
            		running= false;
            	if (pos.x < 40 || pos.x > stage.getWidth()-110)
            		running= false;
                return {
                  x: pos.x,
                  y: pos.y
                };
              }
		});
        Player.prototype.constructor = Player;
	};
	
	function Background(){
		this.squareOut = new Kinetic.Rect({
	            fill: 'black',
	            x : 0,
	            y : 0,
	            width: stage.getWidth()-20,
	            height: stage.getHeight()-20,
	            cornerRadius: 10,
	            shadowColor: 'black',
	            shadowBlur: 10,
	            shadowOffset: 10,
	            shadowOpacity: 0.5
		});
		this.squareIn = new Kinetic.Rect({
	            fill: 'white',
	            x : 40,
	            y : 40,
	            width: stage.getWidth()-(50*2),
	            height: stage.getHeight()-(50*2),
	            cornerRadius: 5
		});
		this.group = new Kinetic.Group();
		this.group.add(this.squareOut);
		this.group.add(this.squareIn);
	}
	Background.prototype.constructor = Background;
	
	function getRandomSize(){
		var aux = {x: null, y:null};
		for (var i in aux){
			range = 100 - 30; 
		   	aleat = Math.random() * range; 
		   	aleat = Math.round(aleat);
		   	aux[i] = parseInt(10) + aleat;
		}
	   	return aux;
	}
	function getRandomPos(background, size){
		var aux = {x: null, y:null};
		for (var i in aux){
			do{
				range = (stage.getWidth()) - 50; 
			   	aleat = Math.random() * range; 
			   	aleat = Math.round(aleat);
			   	aux[i] = parseInt(50) + aleat;
			   	
			}while((aux[i]+size[i])>background.getWidth() ||
					((aux[i]>stage.getWidth()/2-25 && aux[i]<stage.getWidth()/2+25) || 
					 (aux[i]+size[i]>stage.getWidth()/2-25 && aux[i]+size[i]<stage.getWidth()/2+25) ||
				 	 (aux[i]>stage.getWidth()/2-25 && aux[i]+size[i]<stage.getWidth()/2+25))
			);
			
		}
		if(((aux.x>200 && aux.x<250) || 
			(aux.x+size.x>200 && aux.x+size.x<250)) &&
			((aux.y>200 && aux.y<250) || 
					(aux.y+size.y>200 && aux.y+size.y<250)))
			console.log("dentro");
		
	   	return aux;
	}
	
	function getRandomDir(){
		var aux = {x: null, y:null};
		for (var i in aux){
			do{
			range = 1 - (-1); 
		   	aleat = Math.random() * range; 
		   	aleat = Math.round(aleat);
		   	aux[i] = parseInt(-1) + aleat;
			}while(aux[i]==0);
		}
	   	return aux;
	}
	
	function Opponent(pos, size, dir){
		this.square = new Kinetic.Rect({
			x: pos.x,
			y: pos.y,
			width: size.x,
			height: size.y,
			fill: opponentColor,
			stroke: 'black',
			strokeWidth: 4,
			cornerRadius: 5
		});
		this.speed = parseInt($("#opponentSpeed").val());
        this.direction = { x: dir.x, y: dir.y };
	}
	Opponent.prototype.constructor = Opponent;
	
			
	function animOpponents() {
		layer = opponents[0].square.getLayer();
		if (running == true){
			requestAnimationFrame(animOpponents);
	
			for (var i in opponents){
				vo = opponents[i];
				
				var top_x = vo.square.getX();
				var top_y = vo.square.getY();
				var bottom_x = vo.square.getX()+vo.square.getWidth();
				var bottom_y = vo.square.getY()+vo.square.getHeight();
				
				//Rebote en las paredes verticales
				if (top_x < 0 ||
						bottom_x > background.squareOut.getWidth()) 
					vo.direction.x *= -1;
				
				//Rebote en las paredes horizontales
				if (top_y < 0 ||
						bottom_y > background.squareOut.getHeight()) 
					vo.direction.y *= -1;
				
				//Choque
				if(top_y < (player.square.getY() + player.square.getHeight()) && bottom_y > player.square.getY() && top_x < (player.square.getX() + player.square.getWidth()) && bottom_x > player.square.getX())
					reset();
				
				vo.square.setX(vo.square.getX()+(vo.speed*vo.direction.x));
				vo.square.setY(vo.square.getY()+(vo.speed*vo.direction.y));
				layer.draw();
			}
		}
		else{
			reset();
		}
    };
	
    function reset(){
    	running = false;
    	foregroundLayer = opponents[0].square.getLayer();
    	opponents = new Array();
		foregroundLayer.destroyChildren();
		
		for (var i=0;i<nOpponents; i++){
			var size = getRandomSize();
			var pos = getRandomPos(background.squareIn, size);
			var dir = getRandomDir();
			var opponent = new Opponent(pos,size,dir);
			opponents.push(opponent);
			foregroundLayer.add(opponent.square);
		};
		
		player = new Player();
		player.square.on('dragstart', function() {
			if (running == false){
				running = true;
				animOpponents();
			}
	    });
		foregroundLayer.add(player.square);
		
		foregroundLayer.draw();
    }
	
	$(function(){
	    initStage();
	    
	    $("#opponentSpeed" ).change(function() {
	    	for (var i in opponents)
        		opponents[i].speed = parseInt(this.value);
		});
	    
	    $("#backgroundOutColor" ).change(function() {
			background.squareOut.setFill(this.value);
			stage.draw();
		});
	    $("#backgroundInColor" ).change(function() {
			background.squareIn.setFill(this.value);
			stage.draw();
		});
	    
	    $("#selectColorOpponent").ColorPickerSliders({
	        flat: true,
	        swatches: false,
	        color: '#0000FF',
	        order: {
	            rgb: 1,
	            preview: 2
	        },
	        labels: {
	            rgbred: 'Rojo',
	            rgbgreen: 'Verde',
	            rgbblue: 'Azul'
	        },
	        onchange: function(container, color) {
	        	opponentColor = color.tiny.toRgbString();
	        	for (var i in opponents)
	        		opponents[i].square.setFill(opponentColor);
				stage.draw();
	        }
	    });
	    
	    $("#selectColorPlayer").ColorPickerSliders({
	        flat: true,
	        swatches: false,
	        color: '#FF0000',
	        order: {
	            rgb: 1,
	            preview: 2
	        },
	        labels: {
	            rgbred: 'Rojo',
	            rgbgreen: 'Verde',
	            rgbblue: 'Azul'
	        },
	        onchange: function(container, color) {
	        	playerColor = color.tiny.toRgbString();
	        	player.square.setFill(playerColor);
				stage.draw();
	        }
	    });
	});
});