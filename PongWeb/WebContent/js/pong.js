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
	var background = null;
	var middleLine = null;
	var player = null;
	var opponent = null;
	var ball = null;
	var running = false;
	var zones = $("#numberZone").val();
	var mode = "CPU";
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: parseFloat($("#container").css("width")),
		    height: 300
		});
		
		background = new Kinetic.Rect({
		    fill: 'white',
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 20,
		    width : stage.getWidth(),
		    height : stage.getHeight()
		});
		
		middleLine = new Kinetic.Group();
		for (var y = 0; y <= stage.getHeight(); y += 30) {
		    var linePart = new Kinetic.Rect({
		        x : (stage.getWidth()/2)-2,
		        y : y,
		        width : 4,
		        height : 20,
		        fill : 'black'
		    });
		    middleLine.add(linePart);
		};
		
		var backgroundLayer = new Kinetic.Layer();
		backgroundLayer.add(background);
		backgroundLayer.add(middleLine);
		
		var ballLayer = new Kinetic.Layer();
		ball = new Ball(stage, ballLayer);
		ballLayer.add(ball);
		
		var playerLayer = new Kinetic.Layer();
		player = new Player(stage, playerLayer);
		playerLayer.add(player);
		
		opponent = new Opponent(stage, playerLayer);
		playerLayer.add(opponent);
		
		stage.add(backgroundLayer);
		stage.add(ballLayer);
		stage.add(playerLayer);
		
		game = new Game();

		stage.on('dbltap dblclick', function() {
    		if (!running)
    			game.start();
    		else
    			game.stop();
    	});
		
		stage.on('touchmove', function(event) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();
			//var touchPos = stage.getTouchPosition();
			var touchPos = stage.getTouchPosition();
	        player.setY(touchPos.y);
	      });
		
		KeyboardController({
		    83: function() { player.moveDown(); },
		    40: function() { player.moveDown(); },
		    87: function() { player.moveUp(); },
		    38: function() { player.moveUp(); },
		    13: function() { game; }
		}, 10);
	}
	
	function Player(stage,layer){
		var config = {
            fill: 'black',
            x : 80,
            y : stage.getHeight()/2-40,
            width: 10,
            height: 80,
            draggable: true,
            dragBoundFunc: function(pos) {
              return {
                x: this.getAbsolutePosition().x,
                y: pos.y
              };
            },

        };
        Kinetic.Rect.call(this, config);
        this.speed = parseInt($("#leftSpeed").val());;
        this.name = 'Player';
	};
	Player.prototype = new Kinetic.Rect({});
    Player.prototype.constructor = Player;
    
    /*
     * Función para mover abajo la raqueta
     */
    Player.prototype.moveDown = function() {
    	if (this.getY()+40 < stage.getHeight()) 
            this.setY(this.getY()+this.speed);
    };
    
    /*
     * Función para mover arriba la raqueta
     */
    Player.prototype.moveUp = function(playerSpeed) {
        if (this.getY() > -40 )
        	this.setY(this.getY()-this.speed);
    };
    
    function Opponent(stage,layer){
		var config = {
            fill: 'black',
            x : stage.getWidth()-80,
            y : stage.getHeight()/2-40,
            width: 10,
            height: 80,
        };
        Kinetic.Rect.call(this, config);
        this.speed = parseInt($("#rightSpeed").val());
        this.name = 'Opponent';
	};
	Opponent.prototype = new Kinetic.Rect({});
    Opponent.prototype.constructor = Opponent;
    
    function Ball(stage,layer) {
        var config = {
    		radius : 10,
            fill : 'black',
            x : stage.getWidth()/2,
            y : stage.getHeight()/2
        };
        Kinetic.Circle.call(this, config);
        this.speed = parseInt($("#ballSpeed").val());
        this.colorLeft = "black";
        this.colorRight = "black";
        this.direction = { x: +1, y: -1 };
    };
    Ball.prototype = new Kinetic.Circle({});
    Ball.prototype.constructor = Ball;

    function Game() {
        function animBall () {
        	ballLayer = ball.getLayer();
        	
    		if (running == true){
	    		requestAnimationFrame(animBall);

	    		//Cambio de color cuando por las franjas
	    		if (zones==1){
	    			ball.setFill(ball.colorLeft);
	    		}
	    		else{
		    		if (Math.round(ball.getX()/(stage.getWidth()/(zones-1)))%2 == 0 ) {
		    			
		    			ball.setFill(ball.colorLeft);
		    		}else{
		    			ball.setFill(ball.colorRight);
		    		}
	    		}
	    		
	    		ball.setX(ball.getX()+(ball.speed*ball.direction.x));
	    		ball.setY(ball.getY()+(ball.speed*ball.direction.y));
	    		ballLayer.draw();
    		}
	    }; 
	    
	    function animRaquets () {
	    	playerLayer = player.getLayer();
	    	
    		if (running == true){
    			requestAnimationFrame(animRaquets);
				// Drawing code goes here
				if(ball.getX()<stage.getWidth()/2){
					if(mode == "CPU"){
						if(player.getY()+40<ball.getY())
							player.setY(player.getY()+player.speed);
						else
							player.setY(player.getY()-player.speed);
					}
				}
				else{
					if(opponent.getY()+40<ball.getY())
						opponent.setY(opponent.getY()+opponent.speed);
					else
						opponent.setY(opponent.getY()-opponent.speed);
				}
				playerLayer.draw();
				
    		}
			
		}; 
		
		var turno = "derecha";
		function controlCollision () {
			playerLayer = player.getLayer();
			
			var top_x = ball.getX()- ball.getRadius();
			var top_y = ball.getY()- ball.getRadius();
			var bottom_x = ball.getX()+ ball.getRadius();
			var bottom_y = ball.getY()+ ball.getRadius();

    		if (running == true){
				requestAnimationFrame(controlCollision);
				//Rebote en las paredes verticales
				if (top_x < background.getStrokeWidth()/2 ||
	    				bottom_x > stage.getWidth()-(background.getStrokeWidth()/2)) 
	    			ball.direction.x *= -1;
	    		
				//Rebote en las paredes horizontales
				if (top_y < background.getStrokeWidth()/2 ||
	    				bottom_y > stage.getHeight()-(background.getStrokeWidth()/2)) 
	    			ball.direction.y *= -1;
									
				//Rebote en la raqueta izquierda    		
				if(turno=="izquierda" && top_y < (player.getY() + player.getHeight()) && bottom_y > player.getY() && top_x < (player.getX() + player.getWidth()) && bottom_x > player.getX()){
	    			turno = "derecha";
					ball.direction.x = ball.direction.x * (-1);
				}
	    		
    			//Rebote en la raqueta derecha
    			else if(turno=="derecha" && top_y < (opponent.getY() + opponent.getHeight()) && bottom_y > opponent.getY() && top_x < (opponent.getX() + opponent.getWidth()) && bottom_x > opponent.getX()){ 
	    			turno = "izquierda";
    				ball.direction.x = ball.direction.x * (-1);
    			}
			}
		}; 
	    Game.prototype.start = function() {
	    	running = true;
	    	
	    	animBall();
	    	animRaquets();
	    	controlCollision();
	    };
	    
	    Game.prototype.stop = function() {
	    	running = false;
	    };
		
    };
    
    function KeyboardController(keys, repeat) {
        // Lookup of key codes to timer ID, or null for no repeat
        //
        var timers= {};

        // When key is pressed and we don't already think it's pressed, call the
        // key action callback and set a timer to generate another one after a delay
        //
        document.onkeydown= function(event) {
            var key= (event || window.event).keyCode;
            if (!(key in keys))
                return true;
            
            
            if (key == 13 && !running)
            	game.start();
            else if(key == 13 && running)
            	game.stop();
            
            if (mode=="1"){
	            if (!(key in timers)) {
	                timers[key]= null;
	                keys[key]();
	                if (repeat!==0)
	                    timers[key]= setInterval(keys[key], repeat);
	            }
            }
            return false;
        };

        // Cancel timeout and mark key as released on keyup
        //
        document.onkeyup= function(event) {
            var key= (event || window.event).keyCode;
            if (key in timers) {
                if (timers[key]!==null)
                    clearInterval(timers[key]);
                delete timers[key];
            }
        };
    };
    
	$(function(){
	    initStage();
	    $("#backgroundColor" ).change(function() {
			background.setFill(this.value);
			stage.draw();
		});
		
		$("#lineColor" ).change(function() {
			var nodes = middleLine.get('Rect');
			for (var i = 0; i <nodes.length; i++) 
				nodes[i].setFill(this.value);
			stage.draw();
		});
		$("#raquetColor" ).change(function() {
			player.setFill(this.value);
			opponent.setFill(this.value);
			stage.draw();
		});
		
		$("#numberZone" ).change(function() {
			zones = parseInt(this.value);
		});
		
		$("#ballSpeed" ).change(function() {
			ball.speed = parseInt(this.value);
		});
		
		$("#leftSpeed" ).change(function() {
			player.speed = parseInt(this.value);

		});
		
		$("#rightSpeed" ).change(function() {
			opponent.speed = parseInt(this.value);
		});
		
		$( window ).resize(function() {
			stage.setWidth(parseFloat($("#container").css("width")));
			background.setWidth(stage.getWidth());
			opponent.setX(stage.getWidth()-80);
			lines = middleLine.get("Rect");
			for (var i=0; i<lines.length; i ++)
				lines[i].setX((stage.getWidth()/2)-2);
			ball.setX(stage.getWidth()/2);
			
			stage.draw();
		});
		
		
		$(".btn-group > button.btn").on("click", function(){
		    mode = this.value;
		});
		
		$("#selectColorLeft").ColorPickerSliders({
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
	        	ball.setFill(color.tiny.toRgbString());
	        	ball.colorLeft = color.tiny.toRgbString();
				stage.draw();
	        }
	    });
		
		$("#selectColorRight").ColorPickerSliders({
	        flat: true,
	        swatches: false,
	        color: '#00FF00',
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
	        	ball.colorRight = color.tiny.toRgbString();
	        }
	    });
	});
});