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
		    width: screen.width,
		    height: screen.height-100
		});
		
		
		var background = new Background();
		var foreground = new Foreground();
		var menu = new initMenu(stage);
		menu.text.setText("Tetris HTML5\n\n\nPulse para empezar a jugar");
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
		    fill: configuration.board.backgroundColor,
		    stroke: configuration.board.lineColor,
	        strokeWidth: 10,
		    width : (stage.getHeight()/configuration.board.rowNumber)*configuration.board.colNumber,
		    height : stage.getHeight()-10,
		    offset: {x:-5, y: -5},
		    shadowBlur: 10,
	        shadowOffset: [5, 0],
	        shadowOpacity: 0.5
		});

		this.backgroundLayer = new Kinetic.Layer();
		this.backgroundLayer.add(this.background);
		stage.add(this.backgroundLayer);
	}
	
	function Foreground(){
		this.foregroundLayer = new Kinetic.Layer();
		this.rows = configuration.board.rowNumber;
		this.cols = configuration.board.colNumber;
		this.matrix = [];
//		var W = Math.floor(parseFloat($("#container").css("width"))/100)*100;
		this.blockWidth = stage.getHeight()/this.rows;
		
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
			        offset: {x:-5},
			        id: 'foreground'
		        });
		        this.matrix[i][j] = square;
		        this.foregroundLayer.add(this.matrix[i][j]);
			}
		};
		stage.add(this.foregroundLayer);
	}
	
	function NextPiece(blockWidth){
		this.matrix = [];
		
		this.background = new Kinetic.Rect({
		    x : stage.getWidth()-stage.getWidth()*0.4,
		    y : 0,
		    stroke: configuration.board.lineColor,
	        strokeWidth: 5,
		    width : blockWidth*4,
		    height : blockWidth*4,
		    fill: configuration.board.backgroundColor,
		    offset: {x:-5, y: -5},
		    shadowBlur: 10,
	        shadowOffset: [0, 5],
	        shadowOpacity: 0.5
		});
		
		this.nextPieceLayer = stage.find('#foreground')[0].getLayer();
		this.nextPieceLayer.add(this.background);
		for (var i = 0; i < 4; i++){
			this.matrix[i] = [];
			for (var j = 0; j < 4; j++) {
		        var square = new Kinetic.Rect({
		        	x: this.background.getX()+(j * blockWidth),
		    		y: this.background.getY()+(i * blockWidth),
					width: blockWidth,
					height: blockWidth,
					stroke: '#BDBDBD',
			        strokeWidth: 1,
			        offset: {x:-5, y: -5},
		        });
		        this.matrix[i][j] = square;
		        this.nextPieceLayer.add(this.matrix[i][j]);
			}
		};
	}
	
	function Piece(foreground){
		this.pForeground = foreground;
		this.pNextPiece = new NextPiece(this.pForeground.blockWidth);
		
		this.dx = new Array(0,0,0,0);
		this.dy = new Array(0,0,0,0);
		this.dx_ = new Array(0,0,0,0);
		this.dy_ = new Array(0,0,0,0);
		this.xPiece = new Array();
		this.yPiece = new Array();
		this.nSquares = 4;
		this.nTypes = 7;
		this.skyline = this.pForeground.rows-1;
		this.stack = new Array(1);
		//this.mode = '1color';
		this.mode = '2color';
		this.firstColor = calibration.eyeLeft;
		this.secondColor = calibration.eyeRight;
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
	
	Piece.prototype.pushStack = function() {
		for (var i=0;i<this.nSquares;i++) 
			for (var j=0;j<this.nSquares;j++) 
				this.pNextPiece.matrix[i][j].setFill(null);
			
		var next = 1+Math.floor(this.nTypes*Math.random());
		
		this.stack.push(next);
		var dx = new Array(0,0,0,0);
		var dy = new Array(0,0,0,0);
		
		for (var i=0;i<this.nSquares;i++){
			dx[i]=this.xPiece[next][i]; 
			dy[i]=this.yPiece[next][i];
			}
		for (var i=0;i<this.nSquares;i++) {
			var X=2+dx[i];
			var Y=2+dy[i];
			// if (this.mode == '1color')
			// 	this.pNextPiece.matrix[Y][X].setFill(this.firstColor);
			// else
				if(i%2==0)
					this.pNextPiece.matrix[Y][X].setFill(this.firstColor);
				else
					this.pNextPiece.matrix[Y][X].setFill(this.secondColor);
		 }
	};
	
	Piece.prototype.getPiece = function() {
		var curPiece = this.stack.pop();
		this.pushStack();
		
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

			if (this.mode == '1color')
				this.pForeground.matrix[Y][X].setFill(this.firstColor);
			else
				if(i%2==0)
					this.pForeground.matrix[Y][X].setFill(this.firstColor);
				else
					this.pForeground.matrix[Y][X].setFill(this.secondColor);
		 }
		this.pForeground.foregroundLayer.draw();
	};
	
	Piece.prototype.affirmPiece = function() {
		var X= null;
		var Y= null;
		for (var i=0;i<this.nSquares;i++) {
			X=this.curX+this.dx[i];
			Y=this.curY+this.dy[i];
			this.pForeground.matrix[Y][X].setFill("blue");
		}
		if (Y<this.skyline)
			this.skyline=Y;
		else if(this.skyline <= 0){
//			console.log("terminado");
			return true;
		}
		return this.removeLines();
		
	};
	
	Piece.prototype.removeLines = function(){
		var ret = "notGetPoint";
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
			ret = "getPoint";
		}
		return ret;
	};
	
	function Texts(){
    	this.level = 0;
        this.points = 0;
    	
	    this.textScore = new Kinetic.Text({
	    	x:stage.getWidth()/1.75,
            y:stage.getHeight()/2.5,
	    	
            text: 'Nivel: '+ this.level+'\nPuntos: '+ this.points,
			fontSize: 36,
			fontFamily: 'Calibri',
			fontStyle: 'bold',
			fill: configuration.board.textColor,
			shadowBlur: 10,
	        shadowOffset: [0, 5],
	        shadowOpacity: 0.5
		});
        
        this.scoreLayer = stage.find('#foreground')[0].getLayer();
        this.scoreLayer.add(this.textScore);
    };
	
	function Game(background, foreground, menu) {
		this.gBackground = background;
		this.gForeground = foreground;
		this.gMenu = menu;
		this.gPiece = new Piece(this.gForeground);
		this.gTexts = new Texts();
		
		this.pauseState = false;
		this.gravity = configuration.pieces.pieceSpeed;
		this.difficult = "pred";
		this.dictDifficult = {pred:configuration.difficult.incPieceSpeed};
		this.pointLevelUp = configuration.difficult.points;
		this.count = 0;
		
		this.gPiece.pushStack();
		//this.eventsGame();
		stage.draw();
		this.gMenu.mainMenu.on('mouseup touchend',$.proxy(this, "startGame"));
		this.gMenu.pause.on('mousedown touchstart',$.proxy(this, "clickPause"));
		this.gMenu.looseMsg.on('mousedown touchstart',$.proxy(this, "clickLooseMsg"));
		this.gMenu.full.on('mousedown touchstart',$.proxy(this, "toggleFullScreen"));
		this.gMenu.restart.on('mousedown touchstart',$.proxy(this, "restartGame"));
		this.gForeground.foregroundLayer.on('touchmove',$.proxy(this, "movePieceTouch"));
		this.gForeground.foregroundLayer.on('tap',$.proxy(this, "rotatePieceTouch"));
	};
	
	Game.prototype.clickLooseMsg = function(){
		for (var i=0; i<this.gForeground.rows;i++)
			for (var j=0;j<this.gForeground.cols;j++)
				this.gForeground.matrix[i][j].setFill(null);
		this.gravity = configuration.pieces.pieceSpeed;
		this.gPiece.skyline = this.gForeground.rows-1;
		this.updateScore();
		this.gMenu.looseMsg.hide();
		this.gMenu.pause.show();
		this.gMenu.menuLayer.draw();
		this.startGame();
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
	
	Game.prototype.startAnimation = function(){
		this.startFallPiece();
	};
	
	Game.prototype.startFallPiece = function(){
		this.idTimeout = setTimeout($.proxy(function(){
			this.idAnim = requestAnimationFrame(this.startFallPiece.bind(this));
			this.fall();
		},this),this.gravity);
	};
	
	Game.prototype.stopAnimation = function(){
		clearTimeout(this.idTimeout);
		cancelAnimationFrame(this.idAnim);
	};
	
	Game.prototype.fall = function() {
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
			var isFinish = this.gPiece.affirmPiece();
			if (isFinish == true){
				this.gMenu.pause.hide();
				this.gMenu.looseMsg.show();
	        	this.stopAnimation();
	        	var data =  {userId : userID,
	        			confId : configuration._id,
	        			score  : {lines: this.gTexts.points,
		    					level: this.gTexts.level}};
		    	$.post( "/tetrisScore", data );
		    	this.gTexts.level = 0;
	        	this.gTexts.points = 0;
	        	stage.draw();
	    	
			}
			else if(isFinish == "getPoint")
				this.getPoint();
			this.gPiece.getPiece();
		}
	};
	
	Game.prototype.getPoint = function(){
        this.gTexts.points += 10;
        this.checkIfLevelUp();
        this.updateScore();
	};
	
	Game.prototype.updateScore = function(){
		this.gTexts.textScore.setText('Nivel: '+this.gTexts.level+'\nPuntos: '+this.gTexts.points);
	};
	
	Game.prototype.checkIfLevelUp = function(){
		this.count += 10;
		if(this.count == this.pointLevelUp){
			this.count = 0;
			this.gTexts.level += 1;
			this.levelUp();
		}
	};
	
	Game.prototype.levelUp = function(){
		if(this.gravity - this.dictDifficult[this.difficult].speedFactor <= 0)
			this.gravity = 1;
		else
			this.gravity -= this.dictDifficult[this.difficult].speedFactor;
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
		//location.reload();
		this.gMenu.clickPause();
		this.pauseState = false;
		this.gMenu.mainMenu.show();
		this.gMenu.menuLayer.draw();

		this.gTexts.level = 0;
        this.gTexts.points = 0;

        for (var i=0; i<this.gForeground.rows;i++)
			for (var j=0;j<this.gForeground.cols;j++)
				this.gForeground.matrix[i][j].setFill(null);
		this.gravity = configuration.pieces.pieceSpeed;
		this.gPiece.skyline = this.gForeground.rows-1;
		this.updateScore();
		stage.draw();
	};
	
	Game.prototype.movePieceTouch = function(event){

		event.returnValue = false;
		if(event.preventDefault) event.preventDefault();
		var touchPos = stage.getTouchPosition();
		if (this.gPiece.curX > touchPos.x/this.gForeground.blockWidth)
			this.gPiece.moveLeft();
		else if(this.gPiece.curX < touchPos.x/this.gForeground.blockWidth)
			this.gPiece.moveRight();
	};
	
	Game.prototype.rotatePieceTouch = function(event){

		event.returnValue = false;
		if(event.preventDefault) event.preventDefault();
		this.gPiece.rotate();
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
                    if (repeat!==0 && key!=38)
                        timers[key]= setInterval(keys[key], repeat);
                    else if(key==38)
                    	timers[key]= setInterval(keys[key], 200);
                    
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
    
	Game.prototype.eventsGame= function(){
		$(".btn-primary").on("click", $.proxy(function(){
            var val = $(event.target).find('input').val();
            if (val == "1color" || val == "2colors")
            	this.gPiece.mode = $(event.target).find('input').val();
            else
            	this.difficult = val;
	    },this));
		
		$('#backgroundColor').ColorPickerSliders({
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
		    		this.gBackground.background.setFill(color.tiny.toRgbString());
		    		this.gPiece.pNextPiece.background.setFill(color.tiny.toRgbString());
		    		stage.draw();
		    		},this)
		});
		
		$('#lineColor').ColorPickerSliders({
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
		    	this.gPiece.pNextPiece.background.setStroke(color.tiny.toRgbString());
		    	this.gBackground.background.setStroke(color.tiny.toRgbString());
	            stage.draw();
	    		},this)
		});
	    
		$('#textColor').ColorPickerSliders({
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
		    		this.gTexts.textScore.setFill(color.tiny.toRgbString());
		    		stage.draw();
		    		},this)
		});
		
		$("#selectFirstColor").ColorPickerSliders({
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
	            this.gPiece.firstColor = color.tiny.toRgbString();
		    	},this)
	    });
		    
	    $("#selectSecondColor").ColorPickerSliders({
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
		    	this.gPiece.secondColor = color.tiny.toRgbString();
		    },this)
		});
	    
	    $("#pieceSpeed").ionRangeSlider({
			hasGrid: true,
			onChange: $.proxy(function(obj){
		        this.gravity=(1000-(obj.fromNumber*99));
		    },this),
		});
	    
	    $("#colNumber").ionRangeSlider({
			hasGrid: true,
			min: 5,
			max: 30,
			disable: true,
			onChange: $.proxy(function(obj){
		        
		    },this),
		});
	    $("#rowNumber").ionRangeSlider({
			hasGrid: true,
			min: 5,
			max: 30,
			disable: true,
			onChange: $.proxy(function(obj){
		        
		    },this),
		});
	};
	
	$(function(){
	    initStage();
//	    $("#fallSpeed" ).change(function() {
//			gravity = level[parseInt(this.value)];
//		});
	});
});