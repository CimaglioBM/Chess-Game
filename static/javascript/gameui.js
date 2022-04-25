//Defining Variables
var canvasWidth=800;
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
var board;
var pieces;
var spaceSize=75;

function startUI(){
    gameCanvas.start();
    board=new createBoard();
    pieces=new createPieces();
    timer = new createTimer(600, 0, 200, 100, 10, 2);
    bg = new createBackground();
    notation = new createNotation(600, 100);
    gameCanvas.canvas.addEventListener('wheel', scrl);
}

function createBoard(){
    this.draw=function(){
        ctx=gameCanvas.context;
        //draw the dark squares
        ctx.fillStyle = '#e28743';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#eab676';
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if((i+j)%2==0){ctx.fillRect(i*spaceSize,j*spaceSize,spaceSize,spaceSize);}
            }
        }
    }
}
//Pieces
function createPieces(){
    //creating the white pieces
    this.whitePieces=[];

    //pawns
    for(let i=0;i<8;i++){
        this.whitePieces.push(new createPawn(i+1,2,'white'));
    }

    //knights
    this.whitePieces.push(new createKnight(2,1,'white'));
    this.whitePieces.push(new createKnight(7,1,'white'));

    //bishops
    this.whitePieces.push(new createBishop(3,1,'white'));
    this.whitePieces.push(new createBishop(6,1,'white'));

    //rooks
    this.whitePieces.push(new createRook(1,1,'white'));
    this.whitePieces.push(new createRook(8,1,'white'));

    //queen
    this.whitePieces.push(new createQueen(4,1,'white'));

    //king
    this.whitePieces.push(new createKing(5,1,'white'));

    //creating the black pieces
    this.blackPieces=[];

    //pawns
    for(let i=0;i<8;i++){
        this.blackPieces.push(new createPawn(i+1,7,'black'));
    }

    //knights
    this.blackPieces.push(new createKnight(2,8,'black'));
    this.blackPieces.push(new createKnight(7,8,'black'));

    //bishops
    this.blackPieces.push(new createBishop(3,8,'black'));
    this.blackPieces.push(new createBishop(6,8,'black'));

    //rooks
    this.blackPieces.push(new createRook(1,8,'black'));
    this.blackPieces.push(new createRook(8,8,'black'));

    //queen
    this.blackPieces.push(new createQueen(4,8,'black'));

    //king
    this.blackPieces.push(new createKing(5,8,'black'));


    this.draw=function(){
        for(let i=0;i<this.whitePieces.length;i++){
            this.whitePieces[i].draw();
            this.blackPieces[i].draw();
        }
    }
}

function createPawn(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_plt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_pdt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createKnight(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_nlt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_ndt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createBishop(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_blt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_bdt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createRook(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_rlt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_rdt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createQueen(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_qlt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_qdt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createKing(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.draw=function(){
        let img = new Image();
        if(color==='white'){
            img.src="static/images/pieceIcons/white/Chess_klt60.png";
        }else{
            img.src="static/images/pieceIcons/black/Chess_kdt60.png";
        }
        ctx=gameCanvas.context;
        ctx.drawImage(img,this.realX,this.realY,spaceSize,spaceSize);
    }
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

function createBoard(){
    this.draw=function(){
        ctx=gameCanvas.context;
        //draw the dark squares
        ctx.fillStyle = '#e28743';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#eab676';
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if((i+j)%2==0){ctx.fillRect(i*spaceSize,j*spaceSize,spaceSize,spaceSize);}
            }
        }
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
            ctx.fillText(this.movesBlack[i].padEnd(4), x + 200 - 20, y + 25 + 25 * (i - this.scroll));
        }
        ctx.fillStyle = lineColor;
        ctx.fillRect(800 - 3, 0, 3, canvasHeight);
    }
    
}

function createBackground(){
    this.draw = function(){
        ctx = gameCanvas.context;

        ctx.fillStyle = lineColor;
        ctx.fillRect(600, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#181818';
        ctx.fillRect(600 + lineWidth, lineWidth, canvasWidth - lineWidth * 2, canvasHeight - lineWidth * 2);
        
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
            
            board.draw();
            pieces.draw();
            bg.draw();
            timer.draw();
            notation.draw();
            break;
    }
}