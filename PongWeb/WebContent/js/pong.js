$(document).ready(function(){
	window.requestAnimationFrame = (window.webkitRequestAnimationFrame || 
	  window.mozRequestAnimationFrame || 
	  window.msRequestAnimationFrame  || 
	  window.oRequestAnimationFrame );
	
	window.requestAnimFrame  = (window.webkitCancelRequestAnimationFrame    ||
	        window.mozCancelRequestAnimationFrame   ||
	        window.oCancelRequestAnimationFrame 	||
	        window.msCancelRequestAnimationFrame        
	);
	
	var stage = null;
	var background = null;
	var middleLine = null;
	var player = null;
	var opponent = null;
	var ball = null;
	var running = false;
	var zones = 1;
	var mode = "CPU";
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: 800,
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
		
		var playerLayer = new Kinetic.Layer();
		player = new Player(stage, playerLayer);
		playerLayer.add(player);
		
		opponent = new Opponent(stage, playerLayer);
		playerLayer.add(opponent);
		
		var ballLayer = new Kinetic.Layer();
		ball = new Ball(stage, ballLayer);
		ballLayer.add(ball);
		
		stage.add(backgroundLayer);
		stage.add(ballLayer);
		stage.add(playerLayer);
		
		game = new Game();
		
		document.onkeydown = function(event) {
			 event = event || window.event;

			 var e = event.keyCode;
			 //event.preventDefault();
			 if (e == 83 || e == 40) {
				//player.moveDown();
			 } else if (e == 87 || e == 38 ) {
				 //player.moveUp();
			 } else if (e == 13 ) {
				
				if (running == false){
					game.start();
				}
				else{
					game.stop();
				}
			 };
		};
	}
	
	function Player(stage,layer){
		var config = {
            fill: 'black',
            x : 80,
            y : stage.getHeight()/2,
            width: 10,
            height: 80,
            draggable: true,
            dragBoundFunc: function(pos) {
              return {
                x: this.getAbsolutePosition().x,
                y: pos.y
              };
            },
            offset: {
	          x: 5,
	          y: 40
	        }
        };
        Kinetic.Rect.call(this, config);
        this.speed = 10;
        this.name = 'Player';
	};
	Player.prototype = new Kinetic.Rect({});
    Player.prototype.constructor = Player;
	
    function Opponent(stage,layer){
		var config = {
            fill: 'black',
            x : stage.getWidth()-80,
            y : stage.getHeight()/2,
            width: 10,
            height: 80,
            offset: {
	          x: 5,
	          y: 40
	        }
        };
        Kinetic.Rect.call(this, config);
        this.speed = 10;
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
        this.speed = 10;
        this.colorLeft = "black";
        this.colorRight = "black";
        this.direction = { x: +1, y: -1 };
    };
    Ball.prototype = new Kinetic.Circle({});
    Ball.prototype.constructor = Ball;

    /* game class */
    function Game() {
    	/*
    	var tweenLeft = new Kinetic.Tween({
            node: player, 
            duration: 0.1,
            scaleX: 0.5,
            
            easing: Kinetic.Easings.EaseIn
          });
        
        var tweenRight = new Kinetic.Tween({
            node: opponent, 
            duration: 0.1,
            scaleX: 0.5,
            
            easing: Kinetic.Easings.EaseIn
          });
        */
        
        function animBall () {
        	ballLayer = ball.getLayer();
        	
	    	setTimeout(function() {
	    		if (running == true){
		    		requestAnimationFrame(animBall);
	
		    		//Cambio de color cuando por las franjas
		    		if (zones==1){
		    			ball.setFill(ball.colorLeft);
		    		}
		    		else{
			    		if (Math.round(ball.getX()/(stage.getWidth()/zones))%2 == 0 ) {
			    			ball.setFill(ball.colorLeft);
			    		}else{
			    			ball.setFill(ball.colorRight);
			    		}
		    		}
		    		if (ball.getX()-ball.getRadius() <= background.getStrokeWidth()/2 ||
		    				ball.getX()+ball.getRadius() >= stage.getWidth()-(background.getStrokeWidth()/2)) {
		    			ball.direction.x *= -1;
		    		}
		    		if (ball.getY()-ball.getRadius() <= background.getStrokeWidth()/2 ||
		    				ball.getY()+ball.getRadius() >= stage.getHeight()-(background.getStrokeWidth()/2)) {
		    			ball.direction.y *= -1;
		    		}
		    		ball.setX(ball.getX()+(ball.speed*ball.direction.x));
		    		ball.setY(ball.getY()+(ball.speed*ball.direction.y));
		    		ballLayer.draw();
	    		}
	    	}, 1000 / 60);
	    }; 
	    
	    function animRaquets () {
	    	playerLayer = player.getLayer();
	    	setTimeout(function() {
	    		if (running == true){
					anim2 = requestAnimationFrame(animRaquets);
					// Drawing code goes here
					if(ball.getX()<stage.getWidth()/2){
						if(player.getY()<ball.getY())
							player.setY(player.getY()+player.speed);
						else
							player.setY(player.getY()-player.speed);
					}
					else{
						if(opponent.getY()<ball.getY())
							opponent.setY(opponent.getY()+player.speed);
						else
							opponent.setY(opponent.getY()-player.speed);
					}
					playerLayer.draw();
	    		}
			}, 1000 / 60);
		}; 
		
		var turno = "derecha";
		function controlCollision () {
			ballLayer = ball.getLayer();
			setTimeout(function() {
	    		if (running == true){
					anim3 = requestAnimationFrame(controlCollision);
					// Drawing code goes here
					if(ballLayer.getIntersection(player.getPosition()) && turno == "izquierda"){
						ball.direction.x = ball.direction.x * (-1);
		    			turno = "derecha";
		    			
		    			/*tweenLeft.play();
		    			setTimeout(function() {
		    				tweenLeft.reverse();
		    			}, 200);*/
					}
						
					else if(ballLayer.getIntersection(opponent.getPosition()) && turno == "derecha"){
						ball.direction.x = ball.direction.x * (-1);
						turno = "izquierda";
						/*tweenRight.play();
		    			setTimeout(function() {
		    				tweenRight.reverse();
		    			}, 200);*/
					}
	    		}

			}, 1000 / 60);
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
			zones = this.value;
		});
		
		$(".btn-group > button.btn").on("click", function(){
		    mode = this.value;
		});
		
		$("#selectColorLeft").ColorPickerSliders({
	        flat: true,
	        swatches: false,
	        color: '#000000',
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
	        color: '#000000',
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