//Defining Variables
var canvasWidth=200;
var canvasHeight=600;
var gameState=0;
var interval=setInterval(updateCanvas,20);
var gameState=0;
var desc;
var notation;
var bg;
var lineWidth = 3;
var lineColor = 'grey';
var mouseO = false;
var moveSelect = 1;

function startGame(){
    gameCanvas.start();
    desc = new createDescription(0, 0, 200, 80);
    bg = new createBackground();
    notation = new createNotation(0, 80);
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
        c = 0;
        for(let i = this.scroll; i < this.movesWhite.length; i++){
            ctx.font =  this.f;
            if(Math.floor(c / 2) == Math.floor(moveSelect / 2)){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            
            ctx.textAlign = "left";
            ctx.fillText((i + 1).toString() + ":", x + 10, y + 25 + 25 * (i - this.scroll));

            if(c == moveSelect){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            ctx.fillText(this.movesWhite[i], x + 30, y + 25 + 25 * (i - this.scroll));

            c++;
            if(c == moveSelect){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            c++;
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

function createDescription(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.opening = "Sicilian Defense: Delayed Alapin Variation";
    this.moveRec = "Ne7";
    this.eval = 0.5;
    
    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.fillStyle = lineColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + lineWidth, this.y + lineWidth, this.width - lineWidth * 2, this.height - lineWidth * 2);


        ctx.textAlign = "left";
        ctx.font="Bold 10px arial";

        ctx.fillStyle = '#505050';
        ctx.strokeText(this.opening.substr(0, 32) + "...", x + 10 + 2, y + 20 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText(this.opening.substr(0, 32) + "...", x + 10, y + 20);

        ctx.fillStyle = '#505050';
        ctx.strokeText("Engine best move: " + this.moveRec, x + 10 + 2, y + 40 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText("Engine best move: " + this.moveRec, x + 10, y + 40);

        ctx.fillStyle = '#505050';
        ctx.strokeText("Engine evaluation: " + this.eval, x + 10 + 2, y + 60 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText("Engine evaluation: " + this.eval, x + 10, y + 60);
        //cutoff
        ctx.fillStyle = lineColor;
        ctx.fillRect(this.width - lineWidth, this.y, lineWidth, this.height);

        
    }
}

function updateCanvas(){
    switch(gameState){
        case 0:
            bg.draw();
            desc.draw();
            notation.draw();
            break;
    }
}