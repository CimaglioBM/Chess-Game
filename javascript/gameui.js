//Defining Variables
var canvasWidth=200;
var canvasHeight=600;
var gameState=0;
var interval=setInterval(updateCanvas,20);
var gameState=0;
var timer;
var notation;
var bg;
var lineWidth = 3;
var lineColor = 'grey';
var mouseO = false;
var moveCount = 0;

function startGame(){
    gameCanvas.start();
    timer = new createTimer(0, 0, 200, 100, 10, 2);
    bg = new createBackground();
    notation = new createNotation(0, 100);
    gameCanvas.canvas.addEventListener('wheel', scrl);
}



var gameCanvas={
    canvas: document.createElement("canvas"),
    start: function(){
        
        this.canvas.width=canvasWidth;
        this.canvas.height=canvasHeight;
        this.context=this.canvas.getContext("2d",{alpha:false});
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        
    }
}

function scrl(event){
    event.preventDefault();

    notation.addScroll(event.deltaY);
}

function createNotation(x, y){
    this.x = x;
    this.y = y;
    
    this.movesWhite = ["e4", "Nf3", "Bc4"];
    this.movesBlack = ["e5", "Nc6", "Bc5"];
    this.scroll=0;
    
    this.h = canvasHeight - y;

    this.addScroll = function(dY){
        this.scroll += Math.sign(dY);
        this.scroll = Math.max(0, this.scroll);
        this.scroll = Math.min(this.movesBlack.length - 1, this.scroll)
    }
    this.addMove = function(text, white){
        if(white){
            this.movesWhite.push(text);
            this.movesBlack.length = this.movesWhite.length;
        }else{
            this.movesBlack.push(text);
        }
    }
    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.font="Bold 20px arial";
        
        for(let i = this.scroll; i < this.movesWhite.length; i++){
            ctx.font =  this.f;
            ctx.fillStyle = 'white';
            ctx.textAlign = "left";
            ctx.fillText((i + 1).toString() + ":", x + 10, y + 25 + 25 * (i - this.scroll));
            ctx.fillText(this.movesWhite[i], x + 30, y + 25 + 25 * (i - this.scroll));
            ctx.textAlign = "right";
            ctx.fillText(this.movesBlack[i].padEnd(4), x + canvasWidth - 20, y + 25 + 25 * (i - this.scroll));
        }
    }
}

function createBackground(){
    this.draw = function(){
        ctx = gameCanvas.context;

        ctx.fillStyle = lineColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#181818';
        ctx.fillRect(lineWidth, lineWidth, canvasWidth - lineWidth * 2, canvasHeight - lineWidth * 2);
    }
}

function createTimer(x, y, width, height, time, increment){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.time = time;
    this.increment = increment;
    
    this.draw = function(){
        this.minString = Math.floor(this.time);
        this.secString = this.time - Math.floor(this.time);

        ctx = gameCanvas.context;
        ctx.fillStyle = lineColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + lineWidth, this.y + lineWidth, this.width - lineWidth * 2, this.height - lineWidth * 2);


        ctx.textAlign = "right";
        ctx.font="Bold 60px arial";

        ctx.fillStyle = 'silver';
        ctx.fillText(this.minString + ":" + ("0" + this.secString).slice(-2), x + this.width * 0.9, y + this.height * 0.7);

        ctx.strokeStyle = '#505050';
        ctx.strokeText(this.minString + ":" + ("0" + this.secString).slice(-2), x + this.width * 0.9, y + this.height * 0.7);
    }
}

function updateCanvas(){
    switch(gameState){
        case 0:
            bg.draw();
            timer.draw();
            notation.draw();
            break;
    }
}