var stage = null;
function initMenu(stg){
	stage = stg;
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
    this.winMsgGroup();
    this.looseMsgGroup();
    this.pauseMenuGroup();
    this.fullScreenGroup();
    this.restartGroup();
    
    this.menuLayer= new Kinetic.Layer();
    
    this.menuLayer.add(this.fullButton);
    this.menuLayer.add(this.restartButton);
    this.menuLayer.add(this.pause);
    this.menuLayer.add(this.backBox);
    this.menuLayer.add(this.mainMenu);
    this.menuLayer.add(this.winMsg);
    this.menuLayer.add(this.looseMsg);
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
        text: 'Pong HTML5\n\n\nPulse para empezar a jugar',
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

initMenu.prototype.winMsgGroup = function(){
    this.winMsg = new Kinetic.Group({
        x: stage.getWidth()/2,
        y: stage.getHeight()/2,
        offsetX: 150,
        offsetY: 75,
        visible: false
    });
    
    var text = new Kinetic.Text({
        text: '¡¡Has ganado!!\n\n\nPulse para volver a jugar',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: 'white',
        padding: 20,
        width: 300,
        height: 150,
        align: 'center'
    });
    
    var box = new Kinetic.Rect({
        width: 300,
        height: 150,
        opacity: 0.8,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 10,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10
    });
    this.winMsg.add(box);
    this.winMsg.add(text);
    
    this.winMsg.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    this.winMsg.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });
};

initMenu.prototype.looseMsgGroup = function(){
    this.looseMsg = new Kinetic.Group({
        x: stage.getWidth()/2,
        y: stage.getHeight()/2,
        offsetX: 150,
        offsetY: 75,
        visible: false
    });
    
    var text = new Kinetic.Text({
        text: '¡¡Has perdido!!\n\n\nPulse para volver a jugar',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: 'white',
        padding: 20,
        width: 300,
        height: 150,
        align: 'center'
    });
    
    var box = new Kinetic.Rect({
        width: 300,
        height: 150,
        opacity: 0.8,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 10,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10
    });
    this.looseMsg.add(box);
    this.looseMsg.add(text);
    
    this.looseMsg.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    this.looseMsg.on('mouseout', function () {
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