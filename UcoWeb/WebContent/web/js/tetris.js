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

	function initStage(){
		stage = new Kinetic.Stage({
		    container : "container",
		    width: parseFloat($("#container").css("width")),
		    height: $("#rowNumber").val() * parseFloat($("#container").css("width"))/$("#colNumber").val()
		});
		
		var background = new Background();
		var foreground = new Foreground();
		var menu = new initMenu(stage);
		new Game(background, foreground,menu);

//		stage.on('dbltap dblclick', function() {
//    		if (!running)
//    			game.start();
//    		else
//    			game.stop();
//    	});
//		
//		stage.on('mousemove', function(event) {
//			event.returnValue = false;
//			if(event.preventDefault) event.preventDefault();
//
//			var touchPos = stage.getMousePosition();
//			
//			if (curX > parseInt(Math.floor(touchPos.x/blockWidth)))
//				moveLeft();
//			else if(curX < parseInt(Math.floor(touchPos.x/blockWidth)))
//				moveRight();
//	    });
//		
//		stage.on('touchmove', function(event) {
//			event.returnValue = false;
//			if(event.preventDefault) event.preventDefault();
//
//			var touchPos = stage.getTouchPosition();
//			
//			if (curX > parseInt(Math.floor(touchPos.x/blockWidth)))
//				moveLeft();
//			else if(curX < parseInt(Math.floor(touchPos.x/blockWidth)))
//				moveRight();
//	    });
//		
//		stage.on('click', function(event) {
//			event.returnValue = false;
//			if(event.preventDefault) event.preventDefault();
//			rotate();
//	    });
//		
//		stage.on('tap', function(event) {
//			event.returnValue = false;
//			if(event.preventDefault) event.preventDefault();
//			var touchPos = stage.getTouchPosition();
//			var x = parseInt(Math.floor(touchPos.x/blockWidth));
//			var y = parseInt(Math.floor(touchPos.y/blockWidth));
//			
//			if (matrix[y][x].getFill()!=null)
//				rotate();
//	    });
		
//		KeyboardController({
//		    83: function() { moveDown(); },
//		    40: function() { moveDown(); },
//		    87: function() { moveUp(); },
//		    38: function() { rotate(); },
//		    37: function() { moveLeft(); },
//		    39: function() { moveRight(); },
//		    13: function() { game; },
//		}, 10);
	};
	
	function Background(){
		this.background = new Kinetic.Rect({
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 10,
		    width : stage.getWidth(),
		    height : stage.getHeight()
		});

		this.backgroundLayer = new Kinetic.Layer();
		this.backgroundLayer.add(this.background);
		stage.add(this.backgroundLayer);
	}
	
	function Foreground(){
		this.foregroundLayer = new Kinetic.Layer();
		this.rows = $("#rowNumber").val();
		this.cols = $("#colNumber").val();
		this.matrix = [];
//		var W = Math.floor(parseFloat($("#container").css("width"))/100)*100;
		this.blockWidth = parseFloat($("#container").css("width"))/this.cols;
		
		for (var i = 0; i < this.rows; i++){
			this.matrix[i] = [];
			for (var j = 0; j < this.cols; j++) {
		        var square = new Kinetic.Rect({
		        	x: j * this.blockWidth,
		    		y: i * this.blockWidth,
					width: this.blockWidth,
					height: this.blockWidth,
					stroke: '#BDBDBD',
			        strokeWidth: 1,
		        });
		        this.matrix[i][j] = square;
		        this.foregroundLayer.add(this.matrix[i][j]);
			}
		};
		stage.add(this.foregroundLayer);
	}
	
	function Piece(foreground){
		this.pForeground = foreground;
		
		this.dx = new Array(0,0,0,0);
		this.dy = new Array(0,0,0,0);
		this.dx_ = new Array(0,0,0,0);
		this.dy_ = new Array(0,0,0,0);
		this.xPiece = new Array();
		this.yPiece = new Array();
		this.nSquares = 4;
		this.nTypes = 7;
		this.skyline = this.pForeground.rows-1;
		this.mode = '1color';
		
		this.eventsGame();
		//Piece _|_
		this.xPiece[1]= new Array(0, 1, 0, -1);
		this.yPiece[1]= new Array(0, 0, 1, 0);
		
		//Piece |__
		this.xPiece[2]= new Array(0, 1,-1,-1);
		this.yPiece[2]= new Array(0, 0, 1, 0);
		
		//Piece __|
		this.xPiece[3]= new Array(0, 1, 1,-1);
		this.yPiece[3]= new Array(0, 0, 1, 0);
		
		//Piece _|-
		this.xPiece[4]= new Array(0,-1, 0, 1);
		this.yPiece[4]= new Array(0, 0, 1, 1);
		
		//Piece -|_
		this.xPiece[5]= new Array(0, 1, 0,-1);
		this.yPiece[5]= new Array(0, 0, 1, 1);
		
		//Piece --
		this.xPiece[6]= new Array(0, 1,-2,-1);
		this.yPiece[6]= new Array(0, 0, 0, 0);
		
		//Piece []
		this.xPiece[7]= new Array(0, 1, 1, 0);
		this.yPiece[7]= new Array(0, 0, 1, 1);
	};
	
	Piece.prototype.getPiece = function() {
		var curPiece = 1+Math.floor(this.nTypes*Math.random());
		this.curX=Math.floor(this.pForeground.cols/2);
		this.curY=0;

		for (var i=0;i<this.nSquares;i++){
			this.dx[i]=this.xPiece[curPiece][i]; 
			this.dy[i]=this.yPiece[curPiece][i];
			}
		for (i=0;i<this.nSquares;i++){
			this.dx_[i]=this.dx[i]; 
			this.dy_[i]=this.dy[i];
			}
		if (this.pieceFits(this.curX,this.curY)){
			this.drawPiece();
			return 1; 
			}
		return 0;
	};

	Piece.prototype.pieceFits = function(X,Y) {
		for (var i=0;i<this.nSquares;i++) {
			var theX=X+this.dx_[i];
			var theY=Y+this.dy_[i];
			if (theX<0 || theX>=this.pForeground.cols || theY>=this.pForeground.rows || theY<0)
				return 0;
			
			if (this.pForeground.matrix[theY][theX].getFill()=="blue")
				return 0;
		}
		return 1;
	};

	Piece.prototype.moveLeft = function(){
		for (var i=0;i<this.nSquares;i++){
			this.dx_[i]=this.dx[i];
			this.dy_[i]=this.dy[i];
		}
		if (this.pieceFits(this.curX-1,this.curY)){
			this.erasePiece();
			this.curX--;
			this.drawPiece();
		}
	};
	
	Piece.prototype.moveRight = function(){
		for (var i=0;i<this.nSquares;i++){
			this.dx_[i]=this.dx[i];
			this.dy_[i]=this.dy[i];
		}
		if (this.pieceFits(this.curX+1,this.curY)){
			this.erasePiece();
			this.curX++;
			this.drawPiece();
		}
	};
	
	Piece.prototype.moveDown = function(){
		for (var i=0;i<this.nSquares;i++){
			this.dx_[i]=this.dx[i];
			this.dy_[i]=this.dy[i];
		}
		if (this.pieceFits(this.curX,this.curY+1)){
			this.erasePiece();
			this.curY++;
			this.drawPiece();
		}
	};
	
	Piece.prototype.moveUp = function(){
		for (var i=0;i<this.nSquares;i++){
			this.dx_[i]=this.dx[i];
			this.dy_[i]=this.dy[i];
		}
		if (this.pieceFits(this.curX,this.curY-1)){
			this.erasePiece();
			this.curY--;
			this.drawPiece();
		}
		};

	Piece.prototype.rotate = function(){
		for (var i=0;i<this.nSquares;i++){
			this.dx_[i]=-this.dy[i];
			this.dy_[i]=this.dx[i];
		}
		if (this.pieceFits(this.curX,this.curY)){
			this.erasePiece(); 
			for (i=0;i<this.nSquares;i++){
				this.dx[i]=this.dx_[i];
				this.dy[i]=this.dy_[i];
			}
			this.drawPiece();
		}
	};

	Piece.prototype.erasePiece = function(){
		for (var i=0;i<this.nSquares;i++) {
			var X=this.curX+this.dx[i];
			var Y=this.curY+this.dy[i];
//			if (0<=Y && Y<this.pForeground.rows && 0<=X && X<this.pForeground.cols) 
			this.pForeground.matrix[Y][X].setFill(null);
	  	}
	};
	
	Piece.prototype.drawPiece = function() {
		for (var i=0;i<this.nSquares;i++) {
			var X=this.curX+this.dx[i];
			var Y=this.curY+this.dy[i];
//			if (0<=Y && Y<this.pForeground.cols || 0<=X && X<this.pForeground.rows) 
			if (this.mode == '1color')
				this.pForeground.matrix[Y][X].setFill("red");
			else
				if(i%2==0)
					this.pForeground.matrix[Y][X].setFill("red");
				else
					this.pForeground.matrix[Y][X].setFill("green");
		 }
		this.pForeground.foregroundLayer.draw();
	};
	
	Piece.prototype.affirmPiece = function() {
		var X= null;
		var Y= null;
		for (var i=0;i<this.nSquares;i++) {
			X=this.curX+this.dx[i];
			Y=this.curY+this.dy[i];
//			if (0<=Y && Y<this.pForeground.cols || 0<=X && X<this.pForeground.rows)
			this.pForeground.matrix[Y][X].setFill("blue");
		}
		if (Y<this.skyline)
			this.skyline=Y;
		else if(this.skyline <= 0){
			console.log("terminado");
			return true;
		}
		this.removeLines();
	};
	
	Piece.prototype.removeLines = function(){
		for (var i=0;i<this.pForeground.rows;i++) {
			var gapFound=0;
			for (var j=0;j<this.pForeground.cols;j++)
				if (this.pForeground.matrix[i][j].getFill()==null) {
					gapFound=1;
					break;}
			if (gapFound) 
				continue;
			for (var k=i;k>=this.skyline-1;k--)
				for (j=0;j<this.pForeground.cols;j++)
					this.pForeground.matrix[k][j].setFill(this.pForeground.matrix[k-1][j].getFill());
			
			this.skyline++;
		}
	};
	
	Piece.prototype.eventsGame= function(){
		$(".btn-primary").on("click", $.proxy(function(){
            this.mode = $(event.target).find('input').val();
	    },this));
	};
	
	function Game(background, foreground, menu) {
		this.gBackground = background;
		this.gForeground = foreground;
		this.gPiece = new Piece(this.gForeground);
		this.gMenu = menu;
		
		this.pauseState = false;
		this.level = new Array(1000,700,600,500,400,300,200,100,50,10);
//		this.gravity = this.level[($("#fallSpeed").val()-1)];
		this.gravity=10;
		
//		this.startGame();
		this.gMenu.mainMenu.on('mouseup touchend',$.proxy(this, "startGame"));
		this.gMenu.pause.on('mousedown touchstart',$.proxy(this, "clickPause"));
		this.gMenu.full.on('mousedown touchstart',$.proxy(this, "toggleFullScreen"));
		this.gMenu.restart.on('mousedown touchstart',$.proxy(this, "restartGame"));
	};
	
	Game.prototype.startGame = function(){
		this.gMenu.box.setOpacity(0.8);
        this.gMenu.mainMenu.setScale(1);
        setTimeout($.proxy(function(){
        	this.gMenu.mainMenu.hide();
        	this.gMenu.backBoxTween.play();
        	this.gPiece.getPiece();
    		this.gPiece.drawPiece();
        	this.startAnimation();
        	this.enableKeyboard();
    	}, this), 100);
	    
        this.gMenu.menuLayer.draw();
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
		this.startFallPiece();
	};
	
	Game.prototype.startFallPiece = function(){
		this.idTimeout = setTimeout($.proxy(function(){
			this.idAnim = requestAnimationFrame(this.startFallPiece.bind(this));
			this.fall();
		},this), 200);
	};
	
	Game.prototype.stopAnimation = function(){
		clearTimeout(this.idTimeout);
		cancelAnimationFrame(this.idAnim);
	};
	
	Game.prototype.fall = function() {
		var isFinish = false;

		for (var i=0;i<this.gPiece.nSquares;i++){
			this.gPiece.dx_[i]=this.gPiece.dx[i];
			this.gPiece.dy_[i]=this.gPiece.dy[i];
			}
		if (this.gPiece.pieceFits(this.gPiece.curX,this.gPiece.curY+1)){
			this.gPiece.erasePiece();
			this.gPiece.curY++;
			this.gPiece.drawPiece();
			}
		else{
			isFinish = this.gPiece.affirmPiece();
			if (isFinish)
				this.stopAnimation();
			this.gPiece.getPiece();
		}
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
		stage.clear();
		var background = new Background();
		var foreground = new Foreground();
		var menu = new initMenu(stage);
		new Game(background, foreground,menu);
		
	};
	
	Game.prototype.enableKeyboard= function(){
		this.KeyboardController({
            83: $.proxy(function(){ this.gPiece.moveDown(); },this),
            40: $.proxy(function(){ this.gPiece.moveDown(); },this),
            87: $.proxy(function(){ this.gPiece.moveUp(); },this),
            38: $.proxy(function(){ this.gPiece.rotate(); },this),
            37: $.proxy(function(){ this.gPiece.moveLeft(); },this),
		    39: $.proxy(function(){ this.gPiece.moveRight(); },this),
        }, 100);
		
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
	
	Game.prototype.KeyboardController = function(keys, repeat){
		var timers= {};

        document.onkeydown= function(event) {
            var key= (event || window.event).keyCode;
            if (!(key in keys))
                return true;
            
                if (!(key in timers)) {
                    timers[key]= null;
                    keys[key]();
                    if (repeat!==0)
                        timers[key]= setInterval(keys[key], repeat);
                }
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
    
	$(function(){
	    initStage();
	    $("#fallSpeed" ).change(function() {
			gravity = level[parseInt(this.value)];
		});
	});
});