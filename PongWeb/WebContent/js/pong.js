$(document).ready(function(){
	/*
	 * Se ajusta el tamaño del div que contiene el canvas
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
		 * Insertamos una nueva capa al escenario que almacenará el fondo formado
		 * por un color de fondo y una serie de lineas divisorias
		 */
		var backgroundLayer = new Kinetic.Layer();
		var background = new Kinetic.Rect({
		    fill: 'black',
		    x : 0,
		    y : 0,
		    width : W,
		    height : H
		});
		
		var middleLine = new Kinetic.Group();
		for (var y = 0; y <= H; y += 40) {
		    var linePart = new Kinetic.Rect({
		        x : parseInt(W/2),
		        y : y,
		        width : W/140,
		        height : H/15,
		        fill : 'white'
		    });
		    middleLine.add(linePart);
		};
		/*
		 * Añadimos el color de fondo y las lineas divisorias a la capa fondo
		 * e insertamos la capa fondo en el escenario
		 */
		backgroundLayer.add(background);
		backgroundLayer.add(middleLine);
		
		// foreground
        var foregroundLayer = new Kinetic.Layer();
        
        // player
        var player = new Player();
        foregroundLayer.add(player);
        
		stage.add(backgroundLayer);
		stage.add(foregroundLayer);
		
		document.onkeydown = function(event) {
			 event = event || window.event;

			 var e = event.keyCode;

			 if (e == 83 || e == 40) {
				 player.moveDown();
				 
             } else if (e == 87 || e == 38 ) {
                 player.moveUp();
			};
			player.draw();
			
			foregroundLayer.draw();
			stage.draw();
			
		};
	};
	
	function Player(){
		var config = {
                fill: 'white',
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
     * Función para mover abajo la raqueta
     */
    Player.prototype.moveDown = function() {
    	if (this.attrs.y < H-(this.attrs.height/2)) 
            this.setY(this.getY()+this.speed);
        
    };
    
    /*
     * Función para mover arriba la raqueta
     */
    Player.prototype.moveUp = function(playerSpeed) {
        if (this.attrs.y > -(this.attrs.height/2))
        	this.setY(this.getY()-this.speed);
    };
    
	$(function(){
	    initStage();
	});
});