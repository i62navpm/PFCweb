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
	var game = null;
	var greyBack = null;
	var running = false;
	var playerKick = false;
	var zones = $("#numberZone").val();
	var mode = "CPU";
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: parseFloat($("#container").css("width")),
		    height: 300
		});
		
		var backGroup= new Kinetic.Group();
		var background = new Kinetic.Rect({
		    fill: 'white',
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 5,
		    width : stage.getWidth(),
		    height : stage.getHeight(),
		    lineCap: 'round',
		    dashArray: [25, 25, 0.001, 25],
		    id: 'background'
		});
		
		var topLine = new Kinetic.Line({
	    	points: [0, 0, stage.getWidth(), 0],
	        stroke: 'black',
	        strokeWidth: 20,
	        id: 'topLine'
	    });
		
		var bottomLine = new Kinetic.Line({
	    	points: [0, stage.getHeight(), stage.getWidth(), stage.getHeight()],
	        stroke: 'black',
	        strokeWidth: 20,
	        id: 'bottomLine'
	    });
		backGroup.add(background);
		backGroup.add(topLine);
		backGroup.add(bottomLine);
		
	    var middleLine = new Kinetic.Line({
	    	points: [stage.getWidth()/2, 0, stage.getWidth()/2, stage.getHeight()],
	        stroke: 'black',
	        strokeWidth: 6,
	        lineCap: 'round',
	        dashArray: [35, 20],
	        id: 'middleLine'
	    });
		
    	var backBox = new Kinetic.Rect({
            x: 0,
            y: 0,
    		width: stage.getWidth(),
            height: stage.getHeight(),
            opacity: 0.8,
            fill: 'grey',
            id: 'backBox'
    	});
		
		var pause = new Kinetic.Group({
			x: stage.getWidth()-40,
	        y: 50,
	        id: 'pause'
		});
		
		var circlePause = new Kinetic.Circle({
	        radius: 24,
	        stroke: 'black',
	        fill: 'red',
	        strokeWidth: 1,
	        shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [2, 2],
            shadowOpacity: 0.5,
            
		});
		pause.add(circlePause);
		
		var rectPause = new Kinetic.Group();
		for (var i=0; i<2; i++) {
		    var linePause = new Kinetic.Rect({
		    	x: -12+17*i,
		    	y: -12,
		    	width : 6,
		        height : 24,
		        fill : 'white',
	        	shadowColor: 'black',
	            shadowBlur: 10,
	            shadowOffset: [2, 2],
	            shadowOpacity: 0.5,
	            cornerRadius: 2
		    });
		    rectPause.add(linePause);
		};
		pause.add(rectPause);
		
		var trianglePause = new Kinetic.RegularPolygon({
	        sides: 3,
	        radius: 15,
	        rotation: Math.PI/2,
	        fill : 'white',
        	shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [2, 2],
            shadowOpacity: 0.5,
            cornerRadius: 2,
            visible: false
	      });
		pause.add(trianglePause);
		
		var backgroundLayer = new Kinetic.Layer();
		backgroundLayer.add(backGroup);
		backgroundLayer.add(middleLine);
		backgroundLayer.add(pause);
		
		var foregroundLayer = new Kinetic.Layer();
		foregroundLayer.add(backBox);
		
		var pauseLayer = new Kinetic.Layer();
		
		var ballLayer = new Kinetic.Layer();
		var ball = new Ball(stage, ballLayer);
		ballLayer.add(ball);
		
		var playerLayer = new Kinetic.Layer();
		var player = new Player(stage, playerLayer);
		playerLayer.add(player);
		
		var opponent = new Opponent(stage, playerLayer);
		playerLayer.add(opponent);
		
		stage.add(backgroundLayer);
		stage.add(ballLayer);
		stage.add(playerLayer);
		
    	greyBack = new Kinetic.Tween({
	        node: backBox, 
	        duration: 1,
	        opacity: 0,
	        onFinish: function() {
	            foregroundLayer.hide();
	          }
    	});
		
    	game = new Game();
		stage.add(foregroundLayer);
		stage.add(pauseLayer);
    			
		var menu = new initMenu();
		menu.showMenu();
		menu.menuLayer.on('mousedown touchstart', function() {
			if (!running){
				playerLayer.moveUp();
				var tween = null;
				setTimeout(function() {
					pause.remove();
					backgroundLayer.draw();
					pauseLayer.add(pause);
					tween = new Kinetic.Tween({
				        node: pause, 
				        duration: 1,
				        x: stage.getWidth()/2,
				        y: stage.getHeight()/2,
				        rotation: Math.PI * 2,
				        opacity: 0.8,
				        scaleX: 2,
				        scaleY: 2,
				});},1000);
    			menu.clickMenu();
    			pause.on('mouseover', function () {
    	            document.body.style.cursor = 'pointer';
    	        });
    	        pause.on('mouseout', function () {
    	            document.body.style.cursor = 'default';
    	        });
    	        
    			pause.on('mousedown touchstart', function() {
    				setTimeout(function() {
    					console.log(playerKick);
    					if (running){
    						pause.find('Group').hide();
    						pause.find('RegularPolygon').show();
    						foregroundLayer.show();
    						greyBack.reverse();
    						tween.play();
    						game.stop();
    					}
    					else{
    						pause.find('RegularPolygon').hide();
    						pause.find('Group').show();
    						greyBack.play();
    						tween.reverse();
    						
							game.start();
    					}
    			      }, 10);
    			});
    		}
    		
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
            	var ball = stage.find('#ball')[0];
        		var ballLayer = ball.getLayer();
            	var newY= null;
	        	if (pos.y<0){
	        		newY = 0;
	        		if(playerKick)
	        			ball.setY(this.getHeight()/2);
	        	}
	        	else if(pos.y+this.getHeight() > stage.getHeight()){
	        		newY = stage.getHeight()-this.getHeight();
	        		if(playerKick)
	        			ball.setY(stage.getHeight()-this.getHeight()/2);
	        	}
	        	else{
	        		newY = pos.y;
	        		if(playerKick)
	        			ball.setY(pos.y+this.getHeight()/2);
	        	}
	        	
	    		ballLayer.draw();
	//            newY = pos.y < 0 ? 0 : pos.y;
	//           	newY = pos.y+this.getHeight() > stage.getHeight() ? stage.getHeight()-this.getHeight() : pos.y;
	        	return {
	                x: this.getAbsolutePosition().x,
	                y: newY
	              };
            },
            id: 'player'
        };
        Kinetic.Rect.call(this, config);
        this.speed = parseInt($("#leftSpeed").val());
        this.name = 'Player';
	};
	Player.prototype = new Kinetic.Rect({});
    Player.prototype.constructor = Player;
    
    /*
     * Función para mover abajo la raqueta
     */
    Player.prototype.moveDown = function() {
    	if (this.getY()+this.getHeight() < stage.getHeight()){
            this.setY(this.getY()+this.speed);
            this.getLayer().draw();
	    	if (playerKick){
	    		var ball = stage.find('#ball')[0];
	    		var ballLayer = ball.getLayer();
	    		ball.setY(ball.getY()+this.speed);
	    		ballLayer.draw();
	    	}
    	}
    };
    
    /*
     * Función para mover arriba la raqueta
     */
    Player.prototype.moveUp = function() {
    	if (this.getY() > 0 ){
        	this.setY(this.getY()-this.speed);
        	this.getLayer().draw();
        	if (playerKick){
        		var ball = stage.find('#ball')[0];
        		var ballLayer = ball.getLayer();
        		ball.setY(ball.getY()-this.speed);
        		ballLayer.draw();
        	}
        }
    };
    
    function Opponent(stage,layer){
		var config = {
            fill: 'black',
            x : stage.getWidth()-80,
            y : stage.getHeight()/2-40,
            width: 10,
            height: 80,
            id: 'opponent'
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
            y : stage.getHeight()/2,
            id: 'ball'
        };
        Kinetic.Circle.call(this, config);
        this.speed = parseInt($("#ballSpeed").val());
        this.colorLeft = "black";
        this.colorRight = "black";
        this.direction = { x: 1, y: -1 };
    };
    Ball.prototype = new Kinetic.Circle({});
    Ball.prototype.constructor = Ball;

    function Game() {
    	var ball = stage.find('#ball')[0];
    	var player = stage.find('#player')[0];
    	var opponent = stage.find('#opponent')[0];
    	var ballLayer = ball.getLayer();
    	var playerLayer = player.getLayer();
    	
    	var points = 0;
    	var level = 0;
    	var pScore = 0;
    	var oScore = 0;
    	
    	var point = new Kinetic.Text({
			x:player.getX()+player.getWidth(),
			y:player.getY()+player.getHeight()/2,
			text: '10',
            fontSize: 20,
            fontFamily: 'Calibri',
            fontStyle: 'bold',
            fill: 'black',
            opacity: 0
          });
    	
    	var scoreBoard = new Kinetic.Group();
		var playerScore = new Kinetic.Text({
			x:stage.getWidth()/2 - 75,
			y:20,
			text: 0,
            fontSize: 60,
            fontFamily: 'Courier',
            fontStyle: 'bold',
            fill: 'black',
          });
		
		var opponentScore = new Kinetic.Text({
			x:stage.getWidth()/2 +40,
			y:20,
			text: 0,
            fontSize: 60,
            fontFamily: 'Courier',
            fontStyle: 'bold',
            fill: 'black',
          });
		
		var textScore = new Kinetic.Text({
			padding: 20,
			text: 'Nivel: '+level+' Puntos: '+points,
            fontSize: 12,
            fontFamily: 'Calibri',
            fontStyle: 'bold',
            fill: 'black',
          });
		
		var scoreLayer = new Kinetic.Layer();
		scoreBoard.add(playerScore);
		scoreBoard.add(opponentScore);
		scoreBoard.add(textScore);
		scoreLayer.add(scoreBoard);
		scoreLayer.add(point);
    	stage.add(scoreLayer);
    	
    	var anim = new Kinetic.Animation(function(frame) {
            point.setY(point.getY()-5);
          }, scoreLayer);
    	
    	var crash = new Kinetic.Tween({
            node: point, 
            duration: 0.5,
            opacity: 1,
            onFinish: function() {
            	
            	this.reverse();
            	setTimeout(function(){
            		anim.stop();
        		},500);
              }
          });
    	
    	function updateScore(){
    		textScore.setText('Nivel: '+level+' Puntos: '+points);
    		playerScore.setText(pScore);
    		opponentScore.setText(oScore);
    		scoreLayer.draw();
    	}
    	
        function animBall () {
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
		
//		var turno = "derecha";
		var border = stage.find('#topLine')[0].getStrokeWidth()/2;
		var backgroundStroke = stage.find('#background')[0].getStrokeWidth()/2;
		function controlCollision () {
			var top_x = ball.getX()- ball.getRadius();
			var top_y = ball.getY()- ball.getRadius();
			var bottom_x = ball.getX()+ ball.getRadius();
			var bottom_y = ball.getY()+ ball.getRadius();

    		if (running == true){
				requestAnimationFrame(controlCollision);
				//Rebote en las paredes verticales
//				if (top_x < backgroundStroke ||
//	    				bottom_x > stage.getWidth()-(backgroundStroke)) 
//	    			ball.direction.x *= -1;
	    		
				if (top_x < backgroundStroke){
					game.stop();
					oScore += 1;
					updateScore();
					playerKick = true;
					ball.setX(player.getX()+player.getWidth()+ball.getRadius());
					ball.setY(player.getY()+player.getHeight()/2);
					ballLayer.draw();
					ball.direction.x *= -1;
					
					
				}
				else if(bottom_x > stage.getWidth()-(backgroundStroke)){
					game.stop();
					pScore += 1;
					updateScore();
					playerKick = true;
					ball.setX(opponent.getX()-ball.getRadius());
					ball.setY(opponent.getY()+opponent.getHeight()/2);
					ballLayer.draw();
					ball.direction.x *= -1;
				}
				//Rebote en las paredes horizontales
				if (top_y < border ||
	    				bottom_y > stage.getHeight()-border) 
	    			ball.direction.y *= -1;
									
				//Rebote en la raqueta izquierda    		
//				if(turno=="izquierda" && top_y < (player.getY() + player.getHeight()) && bottom_y > player.getY() && top_x < (player.getX() + player.getWidth()) && bottom_x > player.getX()){
				if(top_y < (player.getY() + player.getHeight()) && bottom_y > player.getY() && top_x < (player.getX() + player.getWidth()) && bottom_x > player.getX()){
//	    			turno = "derecha";
					ball.direction.x = ball.direction.x * (-1);
					point.setY(top_y);
					points += 10;
					updateScore();
					anim.start();
					crash.play();
				}
	    		
    			//Rebote en la raqueta derecha
//    			else if(turno=="derecha" && top_y < (opponent.getY() + opponent.getHeight()) && bottom_y > opponent.getY() && top_x < (opponent.getX() + opponent.getWidth()) && bottom_x > opponent.getX()){ 
				else if(top_y < (opponent.getY() + opponent.getHeight()) && bottom_y > opponent.getY() && top_x < (opponent.getX() + opponent.getWidth()) && bottom_x > opponent.getX()){
//	    			turno = "izquierda";
    				ball.direction.x = ball.direction.x * (-1);
    			}
			}
		}; 
	    Game.prototype.start = function() {
	    	running = true;
	    	playerKick = false;
	    	animBall();
	    	animRaquets();
	    	controlCollision();
	    };
	    
	    Game.prototype.stop = function() {
	    	running = false;
	    };
		
    };
    
    function initMenu(){
    	this.group = new Kinetic.Group({
    		x: stage.getWidth()/2,
            y: stage.getHeight()/2,
            offsetX: 150,
        	offsetY: 75
    	});
    	
    	this.text = new Kinetic.Text({
            text: 'Pong HTML5\n\n\nPulse aquí para empezar a jugar',
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: 'white',
            padding: 20,
            width: 300,
            height: 150,
            align: 'center'
          });
    	
    	this.box = new Kinetic.Rect({
            width: 300,
            height: 150,
            opacity: 0.8,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 10,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
    	});
    	this.group.add(this.box);
    	this.group.add(this.text);
    	
    	this.group.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
    	this.group.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
    	
    	this.menuLayer= new Kinetic.Layer();
    	this.menuLayer.add(this.group);
    	
    	stage.add(this.menuLayer);
    };
    
    initMenu.prototype.showMenu = function(){
    	this.menuLayer.show();
    };
    initMenu.prototype.clickMenu = function(){
    	this.box.setOpacity(1);
    	this.group.setScale(0.9);
    	this.menuLayer.draw();
    	this.menuLayer.on('mouseup touchend',$.proxy(this, "hideGroup"));
    };
    initMenu.prototype.hideGroup = function(){
    	this.box.setOpacity(0.8);
    	this.group.setScale(1);
    	this.menuLayer.draw();
    	setTimeout($.proxy(this, "hideLayer"), 100);
    };
    initMenu.prototype.hideLayer = function(){
    	this.menuLayer.hide();
    	greyBack.play();
		game.start();
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
//            else if(key == 13 && running)
//            	game.stop();
            
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
	    
    	var ball = stage.find('#ball')[0];
    	var player = stage.find('#player')[0];
    	var opponent = stage.find('#opponent')[0];
    	var background = stage.find('#background')[0];
    	var topLine = stage.find('#topLine')[0];
    	var bottomLine = stage.find('#bottomLine')[0];
    	var middleLine = stage.find('#middleLine')[0];
    	
	    $("#backgroundColor" ).change(function() {
			background.setFill(this.value);
			stage.draw();
		});
		
		$("#lineColor" ).change(function() {
			middleLine.setStroke(this.value);
			background.setStroke(this.value);
			topLine.setStroke(this.value);
			bottomLine.setStroke(this.value);
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
//			stage.setScaleX(scale)
			background.setWidth(stage.getWidth());
			opponent.setX(stage.getWidth()-80);
			middleLine.setPoints([stage.getWidth()/2, 0, stage.getWidth()/2-5, stage.getHeight()]);
			ball.setX(stage.getWidth()/2);
			
			stage.draw();
		});
		
		
		$(".btn-primary").on("click", function(){
			mode = $(event.target).find('input').val();
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