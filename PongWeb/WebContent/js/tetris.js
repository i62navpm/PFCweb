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
	var rows = 16;
	var cols = 10;
	var blockWidth = 25;
	var matrix = [];
	var nSquares = 4;
	var nTypes = 7;

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
	        strokeWidth: 20,
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
					stroke: 'black',
			        strokeWidth: 2,
		        });
		        
		        matrix[i][j] = square;
		        foregroundLayer.add(matrix[i][j]);
		      }
		};
		stage.add(foregroundLayer);
		stage.add(backgroundLayer);
		getPiece();
		drawPiece();
		
		KeyboardController({
		    83: function() { moveDown(); },
		    40: function() { moveDown(); },
		    87: function() { moveUp(); },
		    38: function() { rotate(); },
		    37: function() { moveLeft(); },
		    39: function() { moveRight(); },

		}, 10);
		fall();
		
	};
	
	function getPiece() {
		curPiece = 1+Math.floor(nTypes*Math.random());
		curX=cols/2;
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
		
	function fall() {
		setTimeout(function() {
		
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
		
		}, 600);
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
	});
});