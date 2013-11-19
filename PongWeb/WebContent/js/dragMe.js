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
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: parseFloat($("#container").css("width")),
		    height: parseFloat($("#container").css("width")),
		});
		
		var backgroundLayer = new Kinetic.Layer();
		var foregroundLayer = new Kinetic.Layer();
		
		background = new Background();
		backgroundLayer.add(background.group);
		
		
		for (var i=0;i<nOpponents; i++){
			var size = getRandomSize();
			var pos = getRandomPos(background.squareIn, size);
			var dir = getRandomDir();
			var aux = new Opponent(pos,size,dir);
			opponents.push(aux);
			foregroundLayer.add(aux.square);
		};
		
		stage.add(backgroundLayer);
		stage.add(foregroundLayer);
		getRandomDir();
		animOpponents();
	}
	
	function Background(){
		this.squareOut = new Kinetic.Rect({
	            fill: 'black',
	            x : 0,
	            y : 0,
	            width: stage.getWidth(),
	            height: stage.getHeight(),

		});
		this.squareIn = new Kinetic.Rect({
	            fill: 'white',
	            x : 50,
	            y : 50,
	            width: stage.getWidth()-(50*2),
	            height: stage.getHeight()-(50*2),
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
			}while((aux[i]+size[i])>background.getWidth())
		}
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
			fill: 'blue',
			stroke: 'black',
			strokeWidth: 4
		});
		this.speed = 2;
        this.direction = { x: dir.x, y: dir.y };
	}
	Opponent.prototype.constructor = Opponent;
	
			
	function animOpponents() {
		layer = opponents[0].square.getLayer();
		requestAnimationFrame(animOpponents);

		for (var i in opponents){
			vo = opponents[i];
			
			
			var top_x = vo.square.getX();
			var top_y = vo.square.getY();
			var bottom_x = vo.square.getX()+vo.square.getWidth();
			var bottom_y = vo.square.getY()+vo.square.getHeight();
			
			//Rebote en las paredes verticales
			if (top_x < 50 ||
					bottom_x > stage.getWidth()-50) 
				vo.direction.x *= -1;
			
			//Rebote en las paredes horizontales
			if (top_y < 50 ||
					bottom_y > stage.getHeight()-50) 
				vo.direction.y *= -1;
			
			
			vo.square.setX(vo.square.getX()+(vo.speed*vo.direction.x));
			vo.square.setY(vo.square.getY()+(vo.speed*vo.direction.y));
			layer.draw();
			
		}
    };
	
	
	$(function(){
	    initStage();
	});
});