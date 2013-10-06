$(document).ready(function(){
	function initStage(){
		/*
		 * Se ajusta el tamaño del div que contiene el canvas
		 * para que la altura sea la mitad de la altura
		*/
		$("#container").css("height",parseFloat($("#container").css("width"))/2);
		var W = parseFloat($("#container").css("width"));
		var H = parseFloat($("#container").css("height"));
		
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
		        width : 4,
		        height : 20,
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
		stage.add(backgroundLayer);

	};
	
	$(function(){
	    initStage();
	});
});