$(document).ready(function(){	

    $("#colNumberTetris").TouchSpin({
        min:5,
        initval: 10,
        max:30,
        buttondown_class: "btn btn-danger",
        buttonup_class: "btn btn-primary",
    });
    $("#rowNumberTetris").TouchSpin({
        min:5,
        initval: 15,
        max:30,
        buttondown_class: "btn btn-danger",
        buttonup_class: "btn btn-primary",
    });
});