$(document).ready(function(){
	
    $("#leftSpeedPong, #rightSpeedPong, #ballSpeedPong, #numberZonePong").TouchSpin({
    	min:1,
    	initval: 5,
        buttondown_class: "btn btn-danger",
        buttonup_class: "btn btn-primary",
    });

    $("#raquetWidthPong").TouchSpin({
        min:1,
        initval: 10,
        max:100,
        buttondown_class: "btn btn-danger",
        buttonup_class: "btn btn-primary",
    });
    $("#raquetHeightPong").TouchSpin({
        min:1,
        initval: 80,
        max:200,
        buttondown_class: "btn btn-danger",
        buttonup_class: "btn btn-primary",
    });
});