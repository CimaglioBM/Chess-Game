//Defining Variables
var canvasWidth=600;
var canvasHeight=600;
var spaceSize=75;
var interval=setInterval(updateCanvas,20);
var gameState=0;
var board;
var pieces;

function startGame(){
    gameCanvas.start();
    board=new createBoard();
    pieces=new createPieces();
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
            img.src='javascript/pieceIcons/white/Chess_plt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_pdt60.png';
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
            img.src='javascript/pieceIcons/white/Chess_nlt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_ndt60.png';
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
            img.src='javascript/pieceIcons/white/Chess_blt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_bdt60.png';
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
            img.src='javascript/pieceIcons/white/Chess_rlt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_rdt60.png';
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
            img.src='javascript/pieceIcons/white/Chess_qlt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_qdt60.png';
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
            img.src='javascript/pieceIcons/white/Chess_klt60.png';
        }else{
            img.src='javascript/pieceIcons/black/Chess_kdt60.png';
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

function updateCanvas(){
    switch(gameState){
        case 0:
            board.draw();
            pieces.draw();
            break;
    }
}