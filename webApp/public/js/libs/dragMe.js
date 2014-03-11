$(document).ready(function(){
	
	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());
	
	var stage = null;
	
	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: screen.width,
		    height: screen.height-100
		});
		
		var background = new Background();
		var player = new Player(background);		
		var opponents = new Opponents(background);
		var menu = new initMenu(stage);
		menu.text.setText("Drag-Me HTML5\n\n\nPulse sobre el cuadrado central para empezar a jugar");
		new Game(background, player, opponents, menu);
	}
	
	function Background(){
		this.squareOut = new Kinetic.Rect({
            fill: configuration.board.backgroundOutColor,
            x : 0,
            y : 0,
            width: (stage.getWidth()*0.7),
            height: stage.getHeight(),
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: 10,
            shadowOpacity: 0.5
		});
		this.squareIn = new Kinetic.Rect({
            fill: configuration.board.backgroundInColor,
            x : 40,
            y : 40,
            width: this.squareOut.getWidth()-(40*2),
            height: this.squareOut.getHeight()-(40*2),
            cornerRadius: 5
		});
		this.group = new Kinetic.Group();
		this.group.add(this.squareOut);
		this.group.add(this.squareIn);
		
		this.backgroundLayer = new Kinetic.Layer();
		this.backgroundLayer.add(this.group);
		stage.add(this.backgroundLayer);
	}
	
	function Player(background){
		this.square = new Kinetic.Rect({
            fill: calibration.eyeLeft,
            x : background.squareOut.getWidth()/2-configuration.pieces.playerSize/2,
            y : background.squareOut.getHeight()/2-configuration.pieces.playerSize/2,
            width: configuration.pieces.playerSize,
            height: configuration.pieces.playerSize,
//          stroke: 'black',
//			strokeWidth: 4,
			cornerRadius: 5,
            draggable: true,
            dragBoundFunc: function(pos) {
                return {
                  x: pos.x,
                  y: pos.y
                };
            },
            id: 'player'
		});
		this.playerLayer = new Kinetic.Layer();
		this.playerLayer.add(this.square);
		stage.add(this.playerLayer);
	};
	
	function Opponents(background){
		this.nOpponents = 4;
		this.opponentLayer = new Kinetic.Layer({id: 'opponents'});
		this.opponents = new Array();
		for (var i=0;i<this.nOpponents; i++){
			var op = new Opponent(background);
			this.opponentLayer.add(op.opponent);
			this.opponents.push(op);
		};
        stage.add(this.opponentLayer);
	};
	
	function Opponent(background){	
		var size = this.getRandomSize();
		var pos = this.getRandomPos(background, size);
		var dir = this.getRandomDir();
		this.opponent = new Kinetic.Rect({
			x: pos.x,
			y: pos.y,
			width: size.x,
			height: size.y,
			fill: calibration.eyeRight,
//			stroke: 'black',
//			strokeWidth: 4,
			cornerRadius: 5
		});
		this.speed = configuration.pieces.opponentSpeed;
        this.direction = { x: dir.x, y: dir.y };
	}
	
	Opponent.prototype.getRandomSize = function(){
		var aux = {x: null, y:null};
		for (var i in aux){
			var range = 100 - 30; 
		   	var aleat = Math.random() * range; 
		   	aleat = Math.round(aleat);
		   	aux[i] = parseInt(10) + aleat;
		}
	   	return aux;
	};
	
	Opponent.prototype.getRandomPos = function(background, size){
		var aux = {x: null, y:null};
		do{
		for (var i in aux){
			aux[i] = Math.floor((Math.random()*background.squareIn.getHeight())+1);
		};
		}while(this.isCollision(background, aux,size));
	   	return aux;
	};

	Opponent.prototype.isCollision = function(background, aux,size) {

			var top_x = aux.x;
			var top_y = aux.y;
			var bottom_x = aux.x+size.x;
			var bottom_y = aux.y+size.y;
			
			var playerX = background.squareOut.getWidth()/2-configuration.pieces.playerSize/2;
			var playerY = background.squareOut.getHeight()/2-configuration.pieces.playerSize/2;
			var playerSize = configuration.pieces.playerSize;
			//Choque
			if(top_y < playerY + playerSize && bottom_y > playerY && top_x < (playerX + playerSize) && bottom_x > playerX)
				return true;
			else
				return false;
			
    };
	
	
	Opponent.prototype.getRandomDir = function(){
		var aux = {x: null, y:null};
		for (var i in aux){
			do{
			var range = 1 - (-1); 
		   	var aleat = Math.random() * range; 
		   	aleat = Math.round(aleat);
		   	aux[i] = parseInt(-1) + aleat;
			}while(aux[i]==0);
		}
	   	return aux;
	};
	
	function Texts(){
        this.time = "00:00:000";
        
	    this.textScore = new Kinetic.Text({
	    	x:stage.getWidth()-200,
            y:stage.getHeight()-300,
            text: 'Tiempo: '+ this.time,
			fontSize: 22,
			fontFamily: 'Calibri',
			fontStyle: 'bold',
			fill: configuration.board.textColor,
			shadowBlur: 10,
	        shadowOffset: [5, 0],
	        shadowOpacity: 0.5
		});
        
        this.scoreLayer = stage.find('#opponents')[0].getLayer();
        this.scoreLayer.add(this.textScore);
	}
	
	
	function Chrono(){
		this.start = 0;
		this.chronoTime = 0;
	};
	
	Chrono.prototype.chronoStart = function(){
		this.start = new Date();
	};
	Chrono.prototype.chronoStartCount = function(){
		var end = new Date();
		var diff = end - this.start;
		diff = new Date(diff);
		var msec = diff.getMilliseconds();
		this.sec = diff.getSeconds();
		var min = diff.getMinutes();
		var hr = diff.getHours()-1;
		if (min < 10){
			min = "0" + min;
		}
		if (this.sec < 10){
			this.sec = "0" + this.sec;
		}
		if(msec < 10){
			msec = "00" +msec;
		}
		else if(msec < 100){
			msec = "0" +msec;
		}

		this.chronoTime = (hr + ":" + min + ":" + this.sec + ":" + msec);
	};
	
	Chrono.prototype.chronoReset = function(){
		this.start = new Date();
	};
	
	function Game(background, player, opponents, menu){
		this.gBackground = background;
		this.gPlayer = player;
		this.gOpponents = opponents;
		this.gTexts = new Texts();
		this.gMenu = menu;
		this.gChrono = new Chrono();
		this.difficult = "pred";
		this.dictDifficult = {pred:{speedFactor:configuration.difficult.incPieceSpeed,timeToUp:configuration.difficult.timePieceSpeed}};
		this.lookTime = true;
		//this.eventsGame();
		stage.draw();
		this.pauseState = false;
		
		this.gMenu.mainMenu.on('mouseup touchend',$.proxy(this, "startGame"));
		this.gMenu.pause.on('mousedown touchstart',$.proxy(this, "clickPause"));
		this.gMenu.full.on('mousedown touchstart',$.proxy(this, "toggleFullScreen"));
		this.gMenu.restart.on('mousedown touchstart',$.proxy(this, "restartGame"));
		this.gPlayer.square.on('dragstart', $.proxy(function(){
    		if (!this.idAnim){
        		this.startAnimation();
        		this.gChrono.chronoStart();
    		}
	    },this));

	};
	
	
	Game.prototype.startGame = function(){
		this.gMenu.box.setOpacity(0.8);
        this.gMenu.mainMenu.setScale(1);
        setTimeout($.proxy(function(){
        	this.gMenu.mainMenu.hide();
        	this.gMenu.backBoxTween.play();
    	}, this), 100);
        this.gMenu.menuLayer.draw();
	};
	
	Game.prototype.startAnimation = function() {
		this.idAnim = requestAnimationFrame(this.startAnimation.bind(this));
		this.gChrono.chronoStartCount();
		this.updateScore();
		this.checkIfLevelUp();
		this.opponentsCollision();
		this.playerCollision();

			this.gOpponents.opponentLayer.draw();		

	};
	
	Game.prototype.checkIfLevelUp = function(){
		
		if(this.lookTime && this.gChrono.sec!= 0 && this.gChrono.sec%this.dictDifficult[this.difficult].timeToUp == 0){
			this.levelUp();
			this.lookTime = false;
			
		}else if(this.gChrono.sec%this.dictDifficult[this.difficult].timeToUp != 0)
			this.lookTime = true;
	};
	
	Game.prototype.levelUp = function(){
		for (i in this.gOpponents.opponents)
			this.gOpponents.opponents[i].speed += this.dictDifficult[this.difficult].speedFactor;
	};
	
	Game.prototype.updateScore= function(){
		this.gTexts.textScore.setText('Tiempo: '+ this.gChrono.chronoTime);
	};
	
	Game.prototype.stopAnimation = function(){
		cancelAnimationFrame(this.idAnim);
		this.gChrono.chronoReset();
		this.idAnim = null;
	};
	
	Game.prototype.playerCollision = function() {
		var top_x = this.gPlayer.square.getX();
		var top_y = this.gPlayer.square.getY();
		var bottom_x = this.gPlayer.square.getX()+this.gPlayer.square.getWidth();
		var bottom_y = this.gPlayer.square.getY()+this.gPlayer.square.getHeight();
		
		if (top_y < 40 || bottom_y > this.gBackground.squareIn.getHeight()+40)
			this.reset();
		else if (top_x < 40 || bottom_x > this.gBackground.squareIn.getWidth()+40)
			this.reset();
	};
	
	Game.prototype.opponentsCollision = function() {
		for (var i=0; i<this.gOpponents.nOpponents; i++){
			var vo = this.gOpponents.opponents[i];

			var top_x = vo.opponent.getX();
			var top_y = vo.opponent.getY();
			var bottom_x = vo.opponent.getX()+vo.opponent.getWidth();
			var bottom_y = vo.opponent.getY()+vo.opponent.getHeight();
			
			//Rebote en las paredes verticales
			if (top_x < 0 ||
					bottom_x > this.gBackground.squareOut.getWidth()) 
				vo.direction.x *= -1;
			
			//Rebote en las paredes horizontales
			if (top_y < 0 ||
					bottom_y > this.gBackground.squareOut.getHeight()) 
				vo.direction.y *= -1;
			
			//Choque
			if(top_y < (this.gPlayer.square.getY() + this.gPlayer.square.getHeight()) && bottom_y > this.gPlayer.square.getY() && top_x < (this.gPlayer.square.getX() + this.gPlayer.square.getWidth()) && bottom_x > this.gPlayer.square.getX())
				this.reset();
			
			vo.opponent.setX(vo.opponent.getX()+(vo.speed*vo.direction.x));
			vo.opponent.setY(vo.opponent.getY()+(vo.speed*vo.direction.y));
			
		}
    };
	
    Game.prototype.reset = function(){
    			var data =  {userId : userID,
        			confId : configuration._id,
        			score  : {times: this.gChrono.chronoTime}};

    	$.post( "/dragMeScore", data );
    	this.stopAnimation();
    	this.gPlayer.square.setDraggable(false);
    	this.gPlayer.square.setX(this.gBackground.squareOut.getWidth()/2-configuration.pieces.playerSize/2);
    	this.gPlayer.square.setY(this.gBackground.squareOut.getWidth()/2-configuration.pieces.playerSize/2);
		for (i in this.gOpponents.opponents){
    		this.gOpponents.opponents[i].speed = configuration.pieces.opponentSpeed;
    		var aux = this.gOpponents.opponents[i].getRandomPos(this.gBackground,{x:this.gOpponents.opponents[i].opponent.getX(), y:this.gOpponents.opponents[i].opponent.getY()});
			this.gOpponents.opponents[i].opponent.setX(aux.x);
			this.gOpponents.opponents[i].opponent.setY(aux.y);
		}
    	
    	this.gPlayer.square.setDraggable(true);
    	stage.draw();
    };
	
    Game.prototype.clickPause= function(){
		if (this.pauseState){
			this.resumeGame();
			this.pauseState = false;
		}
		else{
			this.pauseGame();
			this.pauseState = true;
		}
		
	};
	
	Game.prototype.pauseGame = function(){
		this.stopAnimation();
		this.gMenu.clickPause();
	};
	
	Game.prototype.resumeGame = function(){
		this.gMenu.clickPause();
		setTimeout($.proxy(function(){
			this.startAnimation();
		},this),1000);
	};
	
	Game.prototype.toggleFullScreen = function(){
		var elem=$("#container")[0];
		if (isMobile()){
			$("#container").width('100%');
            $("#container").height('100%');
			$("#container").width($(window).width());
            $("#container").height( $(window).height());
            
			$("#container").css("top",-$("#container").position().top+'px');
			//this.resizeWindow();
		}
		else{
			if (!screenfull.isFullscreen){
				this.oldWidth = $("#container").width();
				this.oldHeight = $("#container").height();
				$("#container").width('100%');
	            $("#container").height('100%');
			}
			else{
				$("#container").width(this.oldWidth);
			    $("#container").height(this.oldHeight);
			}
			screenfull.toggle(elem);
		}
	};
	
	Game.prototype.restartGame = function(){
		this.gMenu.clickPause();
		this.pauseState = false;
		this.gMenu.mainMenu.show();
		this.gMenu.menuLayer.draw();
		this.gTexts.time = "00:00:000";
		this.gChrono.chronoTime = "00:00:000";
		this.updateScore();
		stage.draw();
		this.gPlayer.square.setDraggable(false);
    	this.gPlayer.square.setX(this.gBackground.squareOut.getWidth()/2-configuration.pieces.playerSize/2);
    	this.gPlayer.square.setY(this.gBackground.squareOut.getWidth()/2-configuration.pieces.playerSize/2);
		for (i in this.gOpponents.opponents){
    		this.gOpponents.opponents[i].speed = configuration.pieces.opponentSpeed;
    		var aux = this.gOpponents.opponents[i].getRandomPos(this.gBackground,{x:this.gOpponents.opponents[i].opponent.getX(), y:this.gOpponents.opponents[i].opponent.getY()});
			this.gOpponents.opponents[i].opponent.setX(aux.x);
			this.gOpponents.opponents[i].opponent.setY(aux.y);
		}
    	
    	this.gPlayer.square.setDraggable(true);
    	stage.draw();
	};
	
	Game.prototype.eventsGame = function(){
		$(".btn-group").on("click", $.proxy(function(){
    		this.difficult = $(event.target).find('input').val();
	    },this));
		
		$("#backgroundOutColor").ColorPickerSliders({
	    	previewontriggerelement: true,
		    flat: false,
		    color: '#cf966f',
		    customswatches: false,
		    swatches: ['red', 'green', 'blue'],
		    order: {
		        rgb: 1,
		        preview: 2
		    },
		    onchange: $.proxy(function(container, color){
		    	this.gBackground.squareOut.setFill(color.tiny.toRgbString());
		    	stage.draw();
		    	},this)
	    });

	    $("#backgroundInColor").ColorPickerSliders({
	    	previewontriggerelement: true,
		    flat: false,
		    color: '#cf966f',
		    customswatches: false,
		    swatches: ['red', 'green', 'blue'],
		    order: {
		        rgb: 1,
		        preview: 2
		    },
		    labels: {
		        rgbred: 'Rojo',
		        rgbgreen: 'Verde',
		        rgbblue: 'Azul'
		    },
		    onchange: $.proxy(function(container, color){
	            this.gBackground.squareIn.setFill(color.tiny.toRgbString());
	            stage.draw();
		    	},this)
	    });
	    
	    $("#textColor").ColorPickerSliders({
	    	previewontriggerelement: true,
		    flat: false,
		    color: '#cf966f',
		    customswatches: false,
		    swatches: ['red', 'green', 'blue'],
		    order: {
		        rgb: 1,
		        preview: 2
		    },
		    labels: {
		        rgbred: 'Rojo',
		        rgbgreen: 'Verde',
		        rgbblue: 'Azul'
		    },
		    onchange: $.proxy(function(container, color){
	            this.gTexts.textScore.setFill(color.tiny.toRgbString());
	            stage.draw();
		    	},this)
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
	        onchange: $.proxy(function(container, color){
	        	opponentColor = color.tiny.toRgbString();
	        	for (i in this.gOpponents.opponents)
	        		this.gOpponents.opponents[i].opponent.setFill(opponentColor);
				stage.draw();
	        },this)
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
	        onchange: $.proxy(function(container, color){
	        	this.gPlayer.square.setFill(color.tiny.toRgbString());
				stage.draw();
	        },this)
	    });
	    
	    $("#opponentSpeed").TouchSpin({
	    	min:1,
	    	initval: 5,
	        buttondown_class: "btn btn-danger",
	        buttonup_class: "btn btn-primary",
	    });
		
	    $("#opponentSpeed" ).change($.proxy(function(e){
	    	for (i in this.gOpponents.opponents)
        		this.gOpponents.opponents[i].speed = parseInt(e.target.value); 
		},this));
	    
	    $("#playerSize").ionRangeSlider({
			hasGrid: true,
			min: 0,
			max: 2,
			step: 0.25,
			disable: true,
			onChange: $.proxy(function(obj){
//				var width = this.gBackground.squareOut.getWidth()/2-25;
//				var height = this.gBackground.squareOut.getHeight()/2-25;
//				this.gPlayer.square.setWidth(width*obj.fromNumber);
//				this.gPlayer.square.setHeight(height*obj.fromNumber);
//				stage.draw();
		    },this),
		});
	};
	
	$(function(){
	    initStage();
	});
});