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
		    width: parseFloat($("#container").css("width")),
		    height: 400,
		});
		
		var background = new Background();
		var ball = new Ball();
		var texts = new Texts();
		var player = new Player();
		var opponent = new Opponent();
		var menu = new initMenu();
		new Game(background, ball, player, opponent, menu, texts);

	}
	
	function Background(){
		this.background = new Kinetic.Rect({
		    fill: 'white',
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 20,
		    width : stage.getWidth(),
		    height : stage.getHeight()
		});
		
		this.middleLine = new Kinetic.Line({
            points: [stage.getWidth()/2, 0, stage.getWidth()/2, stage.getHeight()],
	        stroke: 'black',
	        strokeWidth: 6,
	        dashArray: [35, 20],
        
		});
		
		this.backgroundLayer = new Kinetic.Layer();
		this.backgroundLayer.add(this.background);
		this.backgroundLayer.add(this.middleLine);
		stage.add(this.backgroundLayer);
	}
	
	function Ball(){
		this.ball = new Kinetic.Circle({
			radius : 10,
            fill : 'black',
            x : stage.getWidth()/2,
            y : stage.getHeight()/2,
            id: "ball"
		});
		this.speed = parseInt($("#ballSpeed").val());
        this.colorLeft = "black";
        this.colorRight = "black";
        this.direction = { x: +1, y: -1 };
        
        this.ballLayer = new Kinetic.Layer();
		this.ballLayer.add(this.ball);
		stage.add(this.ballLayer);
	}
	
	function Player(){
		this.player = new Kinetic.Rect({
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
		    id: "player"
		
	    });
		
		this.point = new Kinetic.Text({
            x:this.player.getX()+this.player.getWidth(),
            y:this.player.getY()+this.player.getHeight()/2,
            text: '10',
			fontSize: 20,
			fontFamily: 'Calibri',
			fontStyle: 'bold',
			fill: 'black',
			opacity: 0
		});
		
		this.speed = parseInt($("#leftSpeed").val());
		
		this.playerLayer = stage.find('#ball')[0].getLayer();
		this.playerLayer.add(this.player);
		this.playerLayer.add(this.point);
	};

	Player.prototype.moveDown = function() {
        if (this.player.getY()+this.player.getHeight() < stage.getHeight()){
        	this.player.setY(this.player.getY()+this.speed);
        }
	};
	
	Player.prototype.moveUp = function() {
	    if (this.player.getY() > 0){
	        this.player.setY(this.player.getY()-this.speed);
	    }
	};
	
	function Opponent(){
		this.opponent = new Kinetic.Rect({
		    fill: 'black',
		    x : stage.getWidth()-80,
            y : stage.getHeight()/2-40,
		    width: 10,
		    height: 80,
		    id: "opponent"
	    });
		this.speed = parseInt($("#rightSpeed").val());
		
		this.opponentLayer = stage.find('#ball')[0].getLayer();
		this.opponentLayer.add(this.opponent);
	};
	
	function initMenu(){
        this.backBox = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: stage.getWidth(),
            height: stage.getHeight(),
            opacity: 0.8,
            fill: 'grey',
            id: 'backBox'
        });
        
        this.mainMenuGroup();
        this.pauseMenuGroup();
        this.fullScreenGroup();
        this.restartGroup();
        
        this.menuLayer= new Kinetic.Layer();
        
        this.menuLayer.add(this.fullButton);
        this.menuLayer.add(this.restartButton);
        this.menuLayer.add(this.pause);
        this.menuLayer.add(this.backBox);
        this.menuLayer.add(this.mainMenu);
        this.mainMenu.on('mousedown touchstart',$.proxy(this, "clickMenu"));
        stage.add(this.menuLayer);

        this.backBoxTween = new Kinetic.Tween({
            node: this.backBox, 
            duration: 0.2,
            opacity: 0,
            onFinish: $.proxy(function(){
            	this.backBox.hide();
            	this.fullButton.moveToTop();
            	this.restartButton.moveToTop();
            	this.pause.moveToTop();
            },this)
        });
        
        this.pauseTween = new Kinetic.Tween({
            node: this.pause, 
            duration: 1,
            x: stage.getWidth()/2,
            y: stage.getHeight()/2,
            rotation: Math.PI * 2,
            opacity: 0.8,
            scaleX: 2,
            scaleY: 2,
        });
        
        this.fullButtonTween = new Kinetic.Tween({
            node: this.fullButton, 
            duration: 1,
            x: stage.getWidth()/2-75,
            opacity: 0.8,
            easing: Kinetic.Easings['BounceEaseOut'],
            visible: true
        });
        
        this.restartButtonTween = new Kinetic.Tween({
            node: this.restartButton, 
            duration: 1,
            x: stage.getWidth()/2-75,
            opacity: 0.8,
            easing: Kinetic.Easings['BounceEaseOut'],
            visible: true
        });
    };
	
    initMenu.prototype.mainMenuGroup = function(){
    	this.mainMenu = new Kinetic.Group({
            x: stage.getWidth()/2,
            y: stage.getHeight()/2,
            offsetX: 150,
            offsetY: 75,
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
        this.mainMenu.add(this.box);
        this.mainMenu.add(this.text);
        
        this.mainMenu.on('mouseover', function () {
        	document.body.style.cursor = 'pointer';
        });
        this.mainMenu.on('mouseout', function () {
        	document.body.style.cursor = 'default';
        });
    };
    
    initMenu.prototype.pauseMenuGroup = function(){
    	this.pause = new Kinetic.Group({
            x: stage.getWidth()-40,
		    y: 50,
		    id: 'pause'
	    });
		    
	    this.circlePause = new Kinetic.Circle({
		    radius: 24,
		    stroke: 'black',
		    fill: 'red',
		    strokeWidth: 1,
		    shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: [2, 2],
			shadowOpacity: 0.5,
	    });
		    
	    this.rectPause = new Kinetic.Group();
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
	        this.rectPause.add(linePause);
	    };
		    
	    this.trianglePause = new Kinetic.RegularPolygon({
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
	    
	    this.pause.add(this.circlePause);
	    this.pause.add(this.rectPause);
	    this.pause.add(this.trianglePause);
	    
	    this.pause.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        this.pause.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
	};
	
	initMenu.prototype.fullScreenGroup = function(){
		this.fullButton = new Kinetic.Group({
            x: stage.getWidth(),
            y: stage.getHeight()/2-120,
            visible: false
        });
		
        this.fullBox = new Kinetic.Rect({
        	width: 150,
            height: 45,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
            shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: [2, 2],
			shadowOpacity: 0.5,
            cornerRadius: 10
        });
		
        this.full = new Kinetic.Text({
        	width: 150,
            padding:10,
        	text: '[Full Screen]',
            fontSize: 24,
            fontFamily: 'Calibri',
            fill: 'white',
            shadowColor: 'black',
			shadowBlur: 5,
			shadowOffset: [2, 2],
			shadowOpacity: 1,
            align: 'center'
        });
        
        this.fullButton.add(this.fullBox);
        this.fullButton.add(this.full);
        
        this.fullButton.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        this.fullButton.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
	};
	
	initMenu.prototype.restartGroup = function(){
		this.restartButton = new Kinetic.Group({
            x: -150,
            y: stage.getHeight()/2+75,
            visible: false
        });
		
        this.restartBox = new Kinetic.Rect({
        	width: 150,
            height: 45,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
            shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: [2, 2],
			shadowOpacity: 0.5,
            cornerRadius: 10
        });
		
        this.restart = new Kinetic.Text({
        	width: 150,
            padding:10,
        	text: '[Restart]',
            fontSize: 24,
            fontFamily: 'Calibri',
            fill: 'white',
            shadowColor: 'black',
			shadowBlur: 5,
			shadowOffset: [2, 2],
			shadowOpacity: 1,
            align: 'center'
        });
        
        this.restartButton.add(this.restartBox);
        this.restartButton.add(this.restart);
        
        this.restartButton.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        this.restartButton.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });
	};
	
	initMenu.prototype.clickPause = function(){
		if(this.rectPause.isVisible()){
			this.rectPause.hide();
            this.trianglePause.show();
            this.backBox.show();
            this.backBoxTween.reverse();
            this.pauseTween.play();
            this.fullButtonTween.play();
            this.restartButtonTween.play();
		}
		else{
            this.trianglePause.hide();
            this.rectPause.show();
            this.backBoxTween.play();
            this.pauseTween.reverse();
            this.fullButtonTween.reverse();
            this.restartButtonTween.reverse();
		}
	};
	
    initMenu.prototype.clickMenu = function(){
    	this.box.setOpacity(1);
        this.mainMenu.setScale(0.9);
        this.menuLayer.draw();
    };
			
    function Texts(){
    	this.level = 0;
        this.points = 0;
    	this.pScore = 0;
        this.oScore = 0;
    	
    	this.scoreBoard = new Kinetic.Group();
    	this.playerScore = new Kinetic.Text({
            x:stage.getWidth()/2 - 75,
            y:20,
            text: this.pScore,
			fontSize: 60,
			fontFamily: 'Courier',
			fontStyle: 'bold',
			fill: 'black',
			id: 'playerScore'
		});
		    
	    this.opponentScore = new Kinetic.Text({
            x:stage.getWidth()/2 +40,
            y:20,
            text: this.oScore,
			fontSize: 60,
			fontFamily: 'Courier',
			fontStyle: 'bold',
			fill: 'black',
		});
		    
	    this.textScore = new Kinetic.Text({
            padding: 20,
            text: 'Nivel: '+ this.level+' Puntos: '+ this.points,
			fontSize: 12,
			fontFamily: 'Calibri',
			fontStyle: 'bold',
			fill: 'black',
		});
	    
	    this.scoreBoard.add(this.playerScore);
	    this.scoreBoard.add(this.opponentScore);
	    this.scoreBoard.add(this.textScore);
        
        this.scoreLayer = stage.find('#ball')[0].getLayer();
        this.scoreLayer.add(this.scoreBoard);
    };
			
	function Game(background, ball, player, opponent, menu, texts){
		this.gBackground = background;
		this.gBall = ball;
		this.gPlayer = player;
		this.gOpponent = opponent;
		this.gMenu = menu;
		this.gTexts= texts;
		
		this.pauseState = false;
		this.oldWidth = null;
		this.oldHeight = null;
		this.difficult = "easy";
		this.dictDifficult = {easy:{speedBall:1,speedOpponent:0.5},normal:{speedBall:2,speedOpponent:1}, hard:{speedBall:3,speedOpponent:2.5}};
		this.pointLevelUp = 10;
		this.count = 0;
		this.turn = "right";
		this.zones = $("#numberZone").val();
		this.mode = "CPU";
		
		this.eventsGame();
		
		this.crash = new Kinetic.Tween({
            node: this.gPlayer.point, 
            opacity: 1,
            duration: 0.5,
            onFinish: $.proxy(function(){
                this.crash.reverse();
                setTimeout($.proxy(function(){
                	this.stopAnimPoint();
                },this),500);
            },this)
		});
		
		this.gMenu.mainMenu.on('mouseup touchend',$.proxy(this, "startGame"));
		this.gMenu.pause.on('mousedown touchstart',$.proxy(this, "clickPause"));
		this.gMenu.full.on('mousedown touchstart',$.proxy(this, "toggleFullScreen"));
		this.gMenu.restart.on('mousedown touchstart',$.proxy(this, "restartGame"));
		$(window).resize($.proxy(this, "resizeWindow"));
	}
	
	Game.prototype.levelUp = function(){
		this.gBall.speed += this.dictDifficult[this.difficult].speedBall;
		this.gOpponent.speed += this.dictDifficult[this.difficult].speedOpponent;
	};
	
	Game.prototype.startGame = function(){
		this.gMenu.box.setOpacity(0.8);
        this.gMenu.mainMenu.setScale(1);
        setTimeout($.proxy(function(){
        	this.gMenu.mainMenu.hide();
        	this.gMenu.backBoxTween.play();
        	this.startAnimation();
        	this.enableKeyboard();
    	}, this), 100);
	    
        this.gMenu.menuLayer.draw();
	};
	
	Game.prototype.enableKeyboard= function(){
		this.KeyboardController({
            83: $.proxy(function(){ this.gPlayer.moveDown(); },this),
            40: $.proxy(function(){ this.gPlayer.moveDown(); },this),
            87: $.proxy(function(){ this.gPlayer.moveUp(); },this),
            38: $.proxy(function(){ this.gPlayer.moveUp(); },this),
        }, 10);
		
		document.addEventListener("keydown",$.proxy(function(e){
			switch(e.keyCode)
		    {
		        case 113: 
		            this.toggleFullScreen();
		            break;
		        case 13:
		            this.clickPause();
	            	break;
		    }
		},this), false);
	};
	
	Game.prototype.clickPause= function(){
		if (this.pauseState)
			this.resumeGame();
		else
			this.pauseGame();
		this.pauseState = !this.pauseState;
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
	
	Game.prototype.startAnimation = function(){
		this.idBall = requestAnimationFrame(this.startAnimation.bind(this));
		this.controlCollision();
		this.animColor();
		this.animBall();
	    this.animRaquets();
	};
	
	Game.prototype.stopAnimation = function(){
		this.stopMoveBall();
	};
	
	Game.prototype.startAnimPoint = function(){
		this.idPoint = requestAnimationFrame(this.startAnimPoint.bind(this));
		this.gPlayer.point.setY(this.gPlayer.point.getY()-5);
	};
	
	Game.prototype.stopAnimPoint = function(){
		cancelAnimationFrame(this.idPoint);
	};
	
	Game.prototype.animColor = function(){
        if (this.zones==1){
            this.gBall.ball.setFill(this.gBall.colorLeft);
        }
        else{
	        if (Math.round(this.gBall.ball.getX()/(stage.getWidth()/(this.zones-1)))%2 == 0 )
	        	this.gBall.ball.setFill(this.gBall.colorLeft);
	        else
	        	this.gBall.ball.setFill(this.gBall.colorRight);
        }
	};
	
	Game.prototype.animBall = function(){
		this.gBall.ball.setX((this.gBall.ball.getX()+(this.gBall.speed*this.gBall.direction.x)));
		this.gBall.ball.setY((this.gBall.ball.getY()+(this.gBall.speed*this.gBall.direction.y)));
		this.gBall.ballLayer.draw();
	};
	
	Game.prototype.animRaquets= function(){
		if(this.gBall.ball.getX()<stage.getWidth()/2 && this.gBall.direction.x==-1){
			if(this.mode == "CPU"){
				if(this.gBall.ball.getY()>this.gPlayer.player.getY()+40)
			    	this.gPlayer.player.setY(this.gPlayer.player.getY()+this.gPlayer.speed);
			    else
			    	this.gPlayer.player.setY(this.gPlayer.player.getY()-this.gPlayer.speed);
		    }
		}
		else if(this.gBall.ball.getX()>stage.getWidth()/2 && this.gBall.direction.x==1){
	        if(this.gBall.ball.getY()>this.gOpponent.opponent.getY()+40)
	        	this.gOpponent.opponent.setY(this.gOpponent.opponent.getY()+this.gOpponent.speed);
	        else
	        	this.gOpponent.opponent.setY(this.gOpponent.opponent.getY()-this.gOpponent.speed);
		}
	};
	
	Game.prototype.controlCollision = function(){
		var top_x = this.gBall.ball.getX()- this.gBall.ball.getRadius()-this.gBall.speed;
		var top_y = this.gBall.ball.getY()- this.gBall.ball.getRadius();
		var bottom_x = this.gBall.ball.getX()+ this.gBall.ball.getRadius()+this.gBall.speed;
		var bottom_y = this.gBall.ball.getY()+ this.gBall.ball.getRadius();
		
//		if (top_x < 10 || bottom_x > stage.getWidth()-10) 
//			this.gBall.direction.x *= -1;
		if (top_x < 10){
			this.kickPlayer();
			this.turn = "right";
			this.gBall.direction.x *= -1;
		}
		else if(bottom_x > stage.getWidth()-10){
			this.kickOpponent();
			this.turn = "left";
			this.gBall.direction.x *= -1;
		}
		else if (top_y < 10 ||bottom_y > stage.getHeight()-10) 
			this.gBall.direction.y *= -1;
		else if(this.turn == "left" && top_y < (this.gPlayer.player.getY() + this.gPlayer.player.getHeight()) && bottom_y > this.gPlayer.player.getY() && top_x < (this.gPlayer.player.getX() + this.gPlayer.player.getWidth())){
			this.gBall.direction.x = this.gBall.direction.x * (-1);
            this.getPoint(top_y);
            this.turn = "right";
		}
		else if(this.turn == "right" &&top_y < (this.gOpponent.opponent.getY() + this.gOpponent.opponent.getHeight()) && bottom_y > this.gOpponent.opponent.getY() && bottom_x > this.gOpponent.opponent.getX()){ 
			this.gBall.direction.x = this.gBall.direction.x * (-1);
			this.turn = "left";
		}
	};
	
	Game.prototype.getPoint = function(posY){
		this.gPlayer.point.setY(posY);
        this.gTexts.points += 10;
        this.checkIfLevelUp();
        this.updateScore();
        this.startAnimPoint();
        this.crash.play();
        
	};
	
	Game.prototype.checkIfLevelUp = function(){
		this.count += 10;
		if(this.count == this.pointLevelUp){
			this.count = 0;
			this.gTexts.level += 1;
			this.levelUp();
		}
			
	};
	Game.prototype.kickPlayer = function(){
		this.gTexts.oScore += 1;
        this.updateScore();
        posY = this.gPlayer.player.getY()+this.gPlayer.player.getHeight()/2-this.gBall.speed;

        if (posY<10)
        	posY=10-this.gBall.speed+this.gBall.ball.getRadius();
    	else if(posY>stage.getHeight()-10-this.gPlayer.player.getHeight()/2)
    		posY=stage.getHeight()-10-this.gBall.ball.getRadius()-this.gBall.speed;
    	
        this.gBall.ball.setX(this.gPlayer.player.getX()+this.gPlayer.player.getWidth()+this.gBall.ball.getRadius()-this.gBall.speed);
        this.gBall.ball.setY(posY);
        this.gBall.ballLayer.draw();
	};
	
	Game.prototype.kickOpponent = function(){
		this.gTexts.pScore += 1;
        this.updateScore();
        posY = this.gOpponent.opponent.getY()+this.gOpponent.opponent.getHeight()/2-this.gBall.speed;

        if (posY<10)
        	posY=10-this.gBall.speed+this.gBall.ball.getRadius();
    	else if(posY>stage.getHeight()-10-this.gOpponent.opponent.getHeight()/2)
    		posY=stage.getHeight()-10-this.gBall.ball.getRadius()-this.gBall.speed;
    	
        this.gBall.ball.setX(this.gOpponent.opponent.getX()-this.gBall.ball.getRadius()+this.gBall.speed);
        this.gBall.ball.setY(posY);
        this.gBall.ballLayer.draw();
	};
	
	Game.prototype.stopMoveBall = function(){
		cancelAnimationFrame(this.idBall);
	};
	
	Game.prototype.updateScore = function(){
		this.gTexts.textScore.setText('Nivel: '+this.gTexts.level+' Puntos: '+this.gTexts.points);
		this.gTexts.playerScore.setText(this.gTexts.pScore);
		this.gTexts.opponentScore.setText(this.gTexts.oScore);
	};
	
	Game.prototype.toggleFullScreen = function(){
		var elem=$("#container")[0];
		if (isMobile()){
			$("#container").width('100%');
            $("#container").height('100%');
			$("#container").width($(window).width());
            $("#container").height( $(window).height());
            
			$("#container").css("top",-$("#container").position().top+'px');
			this.resizeWindow();
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
		var background = new Background();
		var ball = new Ball();
		var texts = new Texts();
		var player = new Player();
		var opponent = new Opponent();
		var menu = new initMenu();
		new Game(background, ball, player, opponent, menu, texts);
		
	};
	
	Game.prototype.KeyboardController = function(keys, repeat){
		var timers= {};

        document.onkeydown= function(event) {
            var key= (event || window.event).keyCode;
            if (!(key in keys))
                return true;
            
//            if (mode=="1"){
                if (!(key in timers)) {
                    timers[key]= null;
                    keys[key]();
                    if (repeat!==0)
                        timers[key]= setInterval(keys[key], repeat);
                }
//            }
            return false;
        };

        document.onkeyup= function(event) {
            var key= (event || window.event).keyCode;
            if (key in timers) {
                if (timers[key]!==null)
                    clearInterval(timers[key]);
                delete timers[key];
            }
        };
	};
	
	Game.prototype.resizeWindow= function(){
//		var scaleX = stage.getWidth()/W;
//		var scaleY = stage.getHeight()/H;
//		
//		stage.setWidth(parseFloat($("#container").css("width")));
//		stage.setHeight(parseFloat($("#container").css("height")));
//		
//		console.log(scaleX);
//		console.log(scaleY);
//		//stage.setScale({x: scaleX, y:scaleY});
		var newW = parseFloat($("#container").css("width"));
		var newH = parseFloat($("#container").css("height"));
		stage.setWidth(newW);
        stage.setHeight(newH);
		
        this.gBackground.background.setWidth(newW);
        this.gBackground.background.setHeight(newH);
        this.gBackground.middleLine.setPoints([newW/2, 0, newW/2, newH]);
		this.gOpponent.opponent.setX(stage.getWidth()-80);

		if(!this.gMenu.mainMenu.isVisible()){
            this.gMenu.pauseTween.reset();
            this.gMenu.fullButtonTween.reset();
            this.gMenu.restartButtonTween.reset();
            this.gMenu.pause.setX(stage.getWidth()-40);
            this.gMenu.fullButton.setY(stage.getHeight()/2-120);
            this.gMenu.restartButton.setY(stage.getHeight()/2+75);
            this.gMenu.pauseTween = new Kinetic.Tween({
	            node: this.gMenu.pause, 
	            duration: 1,
	            x: stage.getWidth()/2,
	            y: stage.getHeight()/2,
	            rotation: Math.PI * 2,
	            opacity: 0.8,
	            scaleX: 2,
	            scaleY: 2,
            });
            
            this.gMenu.fullButtonTween = new Kinetic.Tween({
                node: this.gMenu.fullButton, 
                duration: 1,
                x: stage.getWidth()/2-75,
                opacity: 0.8,
                easing: Kinetic.Easings['BounceEaseOut'],
                visible: true
            });
            
            this.gMenu.restartButtonTween = new Kinetic.Tween({
                node: this.gMenu.restartButton, 
                duration: 1,
                x: stage.getWidth()/2-75,
                opacity: 0.8,
                easing: Kinetic.Easings['BounceEaseOut'],
                visible: true
            });
            
            if(this.pauseState){
            	this.gMenu.pauseTween.seek(1);
            	this.gMenu.fullButtonTween.seek(1);
            	this.gMenu.restartButtonTween.seek(1);
            }
	    }
	    else{
	    	this.gMenu.pause.setX(newW-40);
	    	this.gMenu.mainMenu.setX(newW/2);
	    }
		
		this.gMenu.backBox.setWidth(newW);
		this.gMenu.backBox.setHeight(newH);
		this.gTexts.playerScore.setX(newW/2 - 75);
		this.gTexts.opponentScore.setX(newW/2 + 40);
		this.gBall.ball.setX(newW/2);
		this.gBall.ball.setY(newH/2);
        stage.draw();
        
	};
	
	Game.prototype.eventsGame= function(){
		$("#backgroundColor" ).change($.proxy(function(e){
			this.gBackground.background.setFill(e.target.value);
            stage.draw();
		},this));
	    
	    $("#lineColor" ).change($.proxy(function(e){
	    	this.gBackground.middleLine.setStroke(e.target.value);
	    	this.gBackground.background.setStroke(e.target.value);
            stage.draw();
	    },this));
	    
	    $("#raquetColor" ).change($.proxy(function(e){
            this.gPlayer.player.setFill(e.target.value);
            this.gOpponent.opponent.setFill(e.target.value);
            stage.draw();
	    },this));
	    
	    $("#numberZone" ).change($.proxy(function(e){
            this.zones = parseInt(e.target.value);
	    },this));
	    
	    $("#ballSpeed" ).change($.proxy(function(e){
	    	this.gBall.speed = parseInt(e.target.value);
	    },this));
	    
	    $("#leftSpeed" ).change($.proxy(function(e){
            this.gPlayer.speed = parseInt(e.target.value);
	    },this));
	    
	    $("#rightSpeed" ).change($.proxy(function(e){
            this.gOpponent.speed = parseInt(e.target.value);
	    },this));
	    
	    $(".btn-primary").on("click", $.proxy(function(){
            this.mode = $(event.target).find('input').val();
	    },this));
    
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
		    onchange: $.proxy(function(container, color){
	            this.gBall.ball.setFill(color.tiny.toRgbString());
	            this.gBall.colorLeft = color.tiny.toRgbString();
	            stage.draw();
		    	},this)
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
		    onchange: $.proxy(function(container, color){
		    	this.gBall.colorRight = color.tiny.toRgbString();
		    },this)
		});
	};
	
	$(function(){
	    initStage();
	});	  
});