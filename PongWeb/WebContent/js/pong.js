$(document).ready(function(){
	/*
	 * Se ajusta el tama�o del div que contiene el canvas
	 * para que la altura sea la mitad de la altura
	*/
	$("#container").css("height",parseFloat($("#container").css("width"))/2);
	var W = parseFloat($("#container").css("width"));
	var H = parseFloat($("#container").css("height"));
	
	
	function initStage(){
		/*
		 * Creamos nuestro escenario con las dimensiones del contenedor div
		 */
		var stage = new Kinetic.Stage({
		    container : "container",
		    width: W,
		    height: H
		});
		
		/*
		 * Insertamos una nueva capa al escenario que almacenar� el fondo formado
		 * por un color de fondo y una serie de lineas divisorias
		 */
		var backgroundLayer = new Kinetic.Layer();
		var background = new Kinetic.Rect({
		    fill: 'white',
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 20,
		    width : W,
		    height : H
		});
		
		var middleLine = new Kinetic.Group();
		for (var y = 0; y <= H; y += H/10) {
		    var linePart = new Kinetic.Rect({
		        x : parseInt(W/2),
		        y : y,
		        width : W/140,
		        height : H/15,
		        fill : 'black'
		    });
		    middleLine.add(linePart);
		};
		/*
		 * A�adimos el color de fondo y las lineas divisorias a la capa fondo
		 * e insertamos la capa fondo en el escenario
		 */
		backgroundLayer.add(background);
		backgroundLayer.add(middleLine);
		
		// foreground
        var foregroundLayer = new Kinetic.Layer();
        
        // player
        var player = new Player();
        foregroundLayer.add(player);
        
        // ball
        var ball = new Ball();
        foregroundLayer.add(ball);
        
        // opponent
        var opponent = new Opponent();
        foregroundLayer.add(opponent);
        
        // game obj
        var game = new Game(stage, foregroundLayer, player, opponent, ball);
		
        stage.add(backgroundLayer);
		stage.add(foregroundLayer);
		
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
		
		
	    
		/*var move = new Kinetic.Animation(function(frame) {
        ball.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
		}, foregroundLayer);*/
		document.onkeydown = function(event) {
			 event = event || window.event;

			 var e = event.keyCode;
			 ball.move(foregroundLayer, player, opponent);
			 opponent.move(game, ball);
			 
			 if (e == 83 || e == 40) {
				 player.moveDown();
				 
             } else if (e == 87 || e == 38 ) {
                 player.moveUp();
			}else if (e == 13 ) {
				game.start();
			};
	
			foregroundLayer.batchDraw();
		};
	};
	
	
	/*
	 * Clase Jugador
	 */
	function Player(){
		var config = {
            fill: 'black',
            x : W/10,
            y : H/2-(H/5)/2,
            width: W/50,
            height: H/5,
            draggable: true,
            dragBoundFunc: function(pos) {
              return {
                x: this.getAbsolutePosition().x,
                y: pos.y
              };
            }
        };
        Kinetic.Rect.call(this, config);
        this.speed = 10;
        this.name = 'Player';
	};
	Player.prototype = new Kinetic.Rect({});
    Player.prototype.constructor = Player;
    
    /*
     * Funci�n para mover abajo la raqueta
     */
    Player.prototype.moveDown = function() {
    	if (this.attrs.y < H-(this.attrs.height/2)) 
            this.setY(this.getY()+this.speed);
    };
    
    /*
     * Funci�n para mover arriba la raqueta
     */
    Player.prototype.moveUp = function(playerSpeed) {
        if (this.attrs.y > -(this.attrs.height/2))
        	this.setY(this.getY()-this.speed);
    };
    
    /* 
     * Clase pelota
    */
    function Ball() {
        var config = {
            radius : W/60,
            fill : 'black',
            x : (W/10+W/50)+W/60,
            y : H/2
        };
        Kinetic.Circle.call(this, config);
        this.speed = 10;
        this.colorLeft = "black";
        this.colorRight = "black";
        this.direction = { x: +1, y: -1 };
    };
    Ball.prototype = new Kinetic.Circle({});
    Ball.prototype.constructor = Ball;
    
    
    
    Ball.prototype.move = function(layer, player, opponent){
        var ball = this;
    	this.anim = new Kinetic.Animation(function(frame) {
    		if (ball.attrs.x <= 0) {
                this.stop();
                opponent.anim.stop();
            }
            
            else if (ball.attrs.x >= W ) {
                this.stop();
                opponent.anim.stop();
            }
    		
    		if (ball.attrs.x <= W/2 ) {
    			ball.setFill(ball.colorLeft);
    		}else{
    			ball.setFill(ball.colorRight);
    		}

    		if (ball.speed > 0 && ball.attrs.y <= W/30 || ball.speed > 0 && ball.attrs.y >= H-(W/30)) {
                ball.direction.y = ball.direction.y * (-1);
            }
            
            else if (ball.speed > 0 && player.intersects(ball.getPosition()) ||
            		ball.speed > 0 && opponent.intersects(ball.getPosition())) {
                
            	ball.direction.x = ball.direction.x * (-1);
                
                if (player.intersects(ball.getPosition())) {
                	ball.attrs.x += 15;
                } else {
                	ball.attrs.x -= 15;
                
                };
                
            } else if (ball.speed == 0 && game.turn == 1){
            	ball.setOnPlayerPosition(player);
            };
            ball.attrs.x += ball.speed * ball.direction.x;
            ball.attrs.y += ball.speed * ball.direction.y;
            ball.setX(ball.attrs.x);
            ball.setY(ball.attrs.y);
    	}, layer);
	};

    Ball.prototype.start = function(){
        this.anim.start();
    };
    
    Ball.prototype.stop = function(){
        this.speed = 0;
    };
    
    Ball.prototype.setOnPlayerPosition = function(side) {
        var _x = null;
    	if (side.name == 'Player') {
            _x = (W/10+W/50)+W/60;
        } else {
            _x = W-((W/10+W/50)+W/60);
        };
        var x = side.getPosition().x + _x;
        var y = side.getPosition().y + 30;
        this.setPosition({x : x, y : y});
    };

    
    
    /* opponent class */
    function Opponent() {
        var config = {
            fill: 'black',
            x : W-W/10,
            y : H/2-(H/5)/2,
            width: W/50,
            height: H/5
        };
        Kinetic.Rect.call(this, config);
        this.speed = 10;
        this.moveTo = undefined;
        this.name = 'Opponent';
    };
    Opponent.prototype = new Kinetic.Rect({});
    Opponent.prototype.constructor = Opponent;
    
    Opponent.prototype.move = function(game, ball) {
        var new_y = undefined;
        var opponent = this;
        this.anim = new Kinetic.Animation(function(frame) {
	        // moving ball
	        if (ball.speed > 0) {
	            if (ball.attrs.x >= W/2) {
	               new_y = ball.attrs.y;
	               
	            } else { new_y = H/2-(H/5)/2; };
	            
	            new_y = Math.round(new_y);
	            opponent.attrs.y = Math.round(opponent.attrs.y);
	            
	            if (opponent.attrs.y < new_y) {
	            	opponent.attrs.y += opponent.speed;
	            	opponent.setY(opponent.attrs.y);
	            } else if (opponent.attrs.y > new_y) {
	            	opponent.attrs.y -= opponent.speed;
	            	opponent.setY(opponent.attrs.y);
	            }
	        }
        }, game.foregroundLayer);
            
    };
    
    Opponent.prototype.start = function(){
        this.anim.start();
    };
    
    /* game class */
    function Game(stage, foregroundLayer, player, opponent, ball) {
        this.stage = stage;
        this.foregroundLayer = foregroundLayer;
        this.level = 1;
        this.player = player;
        this.opponent = opponent,
        this.ball = ball;
        this.scoreMessages = new Array();
        this.running = false;
        this.turn = 1; // 1: player, 0: opponent
        this.over = false;
    };
    
    Game.prototype.stop = function() {
        this.running = false;
    };
    
    Game.prototype.start = function() {
        this.running = true;
        this.ball.start();
		this.opponent.start();
    };
    
	$(function(){
	    initStage();
	});
});