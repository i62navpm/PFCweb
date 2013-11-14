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
	
	
	
	var foregroundLayer = null;
	var rows = $("#rowNumber").val();
	var cols = $("#colNumber").val();
	var W = Math.floor(parseFloat($("#container").css("width"))/100)*100;
	var blockWidth = W/cols;
	var matrix = [];
	var nSquares = 4;
	var nTypes = 7;
	var skyline=rows-1;
	var running = false;
	
	var level = new Array(1000,700,600,500,400,300,200,100,50,10);
	var gravity = level[($("#fallSpeed").val()-1)];
	
	
	var dx = new Array(0,0,0,0);
	var dy = new Array(0,0,0,0);
	var dx_ = new Array(0,0,0,0);
	var dy_ = new Array(0,0,0,0);
	var xPiece = new Array();
	var yPiece = new Array();
	
	//Piece _|_
	xPiece[1]=new Array(0, 1,-1, 0);
	yPiece[1]=new Array(0, 0, 0, 1);
	
	//Piece |__
	xPiece[2]=new Array(0, 1,-1,-1);
	yPiece[2]=new Array(0, 0, 0, 1);
	
	//Piece __|
	xPiece[3]=new Array(0, 1,-1, 1);
	yPiece[3]=new Array(0, 0, 0, 1);
	
	//Piece _|-
	xPiece[4]=new Array(0,-1, 1, 0);
	yPiece[4]=new Array(0, 0, 1, 1);
	
	//Piece -|_
	xPiece[5]=new Array(0, 1,-1, 0);
	yPiece[5]=new Array(0, 0, 1, 1);
	
	//Piece --
	xPiece[6]=new Array(0, 1,-1,-2);
	yPiece[6]=new Array(0, 0, 0, 0);
	
	//Piece []
	xPiece[7]=new Array(0, 1, 1, 0);
	yPiece[7]=new Array(0, 0, 1, 1);
	
	function initStage(){
		var stage = new Kinetic.Stage({
		    container : "container",
		    width: cols * blockWidth,
		    height: rows * blockWidth
		});
		
		var background = new Kinetic.Rect({
		    x : 0,
		    y : 0,
		    stroke: 'black',
	        strokeWidth: 10,
		    width : stage.getWidth(),
		    height : stage.getHeight()
		});

		var backgroundLayer = new Kinetic.Layer();
		backgroundLayer.add(background);

		foregroundLayer = new Kinetic.Layer();
		
		for (var i = 0; i < rows; i++){
			matrix[i] = [];
		    for (var j = 0; j < cols; j++) {
		        square = new Kinetic.Rect({
		        	x: j * blockWidth,
		    		y: i * blockWidth,
					width: blockWidth,
					height: blockWidth,
					stroke: '#BDBDBD',
			        strokeWidth: 1,
		        });
		        
		        matrix[i][j] = square;
		        foregroundLayer.add(matrix[i][j]);
		      }
		};
		stage.add(foregroundLayer);
		stage.add(backgroundLayer);
		getPiece();
		drawPiece();
		
		game = new Game();

		stage.on('dbltap dblclick', function() {
    		if (!running)
    			game.start();
    		else
    			game.stop();
    	});
		
		stage.on('mousemove', function(event) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();

			var touchPos = stage.getMousePosition();
			
			if (curX > parseInt(Math.floor(touchPos.x/blockWidth)))
				moveLeft();
			else if(curX < parseInt(Math.floor(touchPos.x/blockWidth)))
				moveRight();
	    });
		
		stage.on('touchmove', function(event) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();

			var touchPos = stage.getTouchPosition();
			
			if (curX > parseInt(Math.floor(touchPos.x/blockWidth)))
				moveLeft();
			else if(curX < parseInt(Math.floor(touchPos.x/blockWidth)))
				moveRight();
	    });
		
		stage.on('click', function(event) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();
			rotate();
	    });
		
		stage.on('tap', function(event) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();
			var touchPos = stage.getTouchPosition();
			var x = parseInt(Math.floor(touchPos.x/blockWidth));
			var y = parseInt(Math.floor(touchPos.y/blockWidth));
			
			if (matrix[y][x].getFill()!=null)
				rotate();
	    });
		
		KeyboardController({
		    83: function() { moveDown(); },
		    40: function() { moveDown(); },
		    87: function() { moveUp(); },
		    38: function() { rotate(); },
		    37: function() { moveLeft(); },
		    39: function() { moveRight(); },
		    13: function() { game; },
		}, 10);
  
	};
	
	function Game() {
		function fall() {
			setTimeout(function() {
				if (running == true){
					requestAnimationFrame(fall);
					for (var k=0;k<nSquares;k++){
						dx_[k]=dx[k];
						dy_[k]=dy[k];
						}
					if (pieceFits(curX,curY+1)){
						erasePiece();
						curY++;
						drawPiece();
						}
					else{
						affirmPiece();
						getPiece();
					}
				}
			}, gravity);
		}
		Game.prototype.start = function() {
	    	running = true;
	    	fall();
	    };
	    
	    Game.prototype.stop = function() {
	    	running = false;
	    };
	}
    
	
	
	function getPiece() {
		curPiece = 1+Math.floor(nTypes*Math.random());
		curX=Math.floor(cols/2);
		curY=0;
		for (var k=0;k<nSquares;k++){
			dx[k]=xPiece[curPiece][k]; 
			dy[k]=yPiece[curPiece][k];
			}
		for (var k=0;k<nSquares;k++){
			dx_[k]=dx[k]; dy_[k]=dy[k];
			}
		if (pieceFits(curX,curY)){
			drawPiece();
			return 1; 
			}
		return 0;
	}

	function pieceFits(X,Y) {
		for (var k=0;k<nSquares;k++) {
			
			theX=X+dx_[k];
			theY=Y+dy_[k];

			
			if (theX<0 || theX>=cols || theY>=rows || theY<0)
				return 0;
			if (matrix[theY][theX].getFill()=="blue"){

				return 0;
			}
			
		}
		return 1;
	}

	function drawPiece() {
		for (var k=0;k<nSquares;k++) {
			X=curX+dx[k];
			Y=curY+dy[k];
			if (0<=Y && Y<cols || 0<=X && X<rows) {
				matrix[Y][X].setFill("red");
				}
			foregroundLayer.draw();
		 }
	}
	
	function affirmPiece() {
		for (var k=0;k<nSquares;k++) {
			X=curX+dx[k];
			Y=curY+dy[k];
			if (0<=Y && Y<cols || 0<=X && X<rows) {
				matrix[Y][X].setFill("blue");
				}
			foregroundLayer.draw();
		 }
		if (Y<skyline)
			skyline=Y;
		else if(skyline <= 0){
			running = false;
			console.log("terminado");
		}
		removeLines();
	}
	
	function removeLines() {
		for (var i=0;i<rows;i++) {
			gapFound=0;
			for (var j=0;j<cols;j++) {
				if (matrix[i][j].getFill()==null) {
					gapFound=1;
					break;}
			}
			if (gapFound) 
				continue;
			for (var k=i;k>=skyline-1;k--) {
				for (var j=0;j<cols;j++) {
					matrix[k][j].setFill(matrix[k-1][j].getFill());
				}
			}


			
			skyline++;
			foregroundLayer.draw();
			
			/*
			nLines++;
			self.f1.document.form1.Lines.value=nLines;
			if (nLines%5==0) {
				Level++; if(Level>10) Level=10;
			}
			speed=speed0-speedK*Level;
			self.f1.document.form1.s1.selectedIndex=Level-1;
			*/
		}
	}

	
	function moveLeft() {
		 for (var k=0;k<nSquares;k++){
			 dx_[k]=dx[k];
			 dy_[k]=dy[k];
			 }
		 if (pieceFits(curX-1,curY)){
			 erasePiece();
			 curX--;
			 drawPiece();
			 }
		}
	
	function moveRight() {
		 for (var k=0;k<nSquares;k++){
			 dx_[k]=dx[k];
			 dy_[k]=dy[k];
			 }
		 if (pieceFits(curX+1,curY)){
			 erasePiece();
			 curX++;
			 drawPiece();
			 }
		}
	
	function moveDown() {
		 for (var k=0;k<nSquares;k++){
			 dx_[k]=dx[k];
			 dy_[k]=dy[k];
			 }
		 if (pieceFits(curX,curY+1)){
			 erasePiece();
			 curY++;
			 drawPiece();
			 }
		}
	
	function moveUp() {
		 for (var k=0;k<nSquares;k++){
			 dx_[k]=dx[k];
			 dy_[k]=dy[k];
			 }
		 if (pieceFits(curX,curY-1)){
			 erasePiece();
			 curY--;
			 drawPiece();
			 }
		}

	function rotate() {
		if (curPiece != 7){
			for (var k=0;k<nSquares;k++){
				 dx_[k]=-dy[k];
				 dy_[k]=dx[k];
				 }
			if (pieceFits(curX,curY)){
			  erasePiece(); 
			for (var k=0;k<nSquares;k++){
				  dx[k]=dx_[k];
				  dy[k]=dy_[k];
				  }
			drawPiece();
			}
		}
	}

	function erasePiece() {
		for (var k=0;k<nSquares;k++) {
			X=curX+dx[k];
			Y=curY+dy[k];
			if (0<=Y && Y<rows && 0<=X && X<cols) {
				matrix[Y][X].setFill(null);
				foregroundLayer.draw();
			}
	  	}
	}
		
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
            
            if (!(key in timers)) {
                timers[key]= null;
                keys[key]();
                if (repeat!==0)
                    timers[key]= setInterval(keys[key], repeat);
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
	    $("#fallSpeed" ).change(function() {
			gravity = level[parseInt(this.value)];
		});
	});
});