//Defining Variables
var canvasWidth=800;
var canvasHeight=600;
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
var selected = 0;
var chosenColor = 0;
var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var computerMove = null;
//white: playerColor = 0
//black: playerColor = 1
var playerColor = 0;
function square(x, y){
    pstr = String();
    for(i = 0; i < 8; i++){
        if((x-1)==i){
            switch(i){
                case(0):
                    pstr = "a" + (y).toString();
                    return pstr;
                case(1):
                    pstr = "b" + (y).toString();
                    return pstr;
                case(2):
                    pstr = "c" + (y).toString();
                    return pstr;
                case(3):
                    pstr = "d" + (y).toString();
                    return pstr;
                case(4):
                    pstr = "e" + (y).toString();
                    return pstr;
                case(5):
                    pstr = "f" + (y).toString();
                    return pstr;
                case(6):
                    pstr = "g" + (y).toString();
                    return pstr;
                case(7):
                    pstr = "h" + (y).toString();
                    return pstr;
            }
        }
    }
    
}

function makeMove(x, y){
    promotion = '';
    if(selected.type === "pawn" && (y == 1 || y == 8)){
        promotion = 'q';
    }
    success = $.ajax({type: "GET", url: '/legalMoves?fen='+fen+'&moveStart='+square(selected.x, selected.y)+'&moveEnd='+square(x, y) + promotion, async: false}).responseText;
    if(success==="true"){
        notation.addMove($.ajax({type: "GET", url: '/uciToAn?fen='+fen+'&moveStart='+square(selected.x, selected.y)+'&moveEnd='+square(x, y) + promotion, async: false}).responseText, Math.abs(1-playerColor));
        fen = $.ajax({type: "GET", url: '/getNewFen?fen='+fen+'&moveStart='+square(selected.x, selected.y)+'&moveEnd='+square(x, y) + promotion, async: false}).responseText;
        
        pieces.setPieces(fen);
        /*
        selected.x = x;
        selected.y = y;
        if(playerColor == 1){
            for(let i = 0; i < pieces.whitePieces.length; i++){
                if(pieces.whitePieces[i].x == x && pieces.whitePieces[i].y == y){
                    pieces.whitePieces.splice(i, 1);
                }
            }
            
        }else if(playerColor == 0){
            for(let i = 0; i < pieces.blackPieces.length; i++){
                if(pieces.blackPieces[i].x == x && pieces.blackPieces[i].y == y){
                    pieces.blackPieces.splice(i, 1);
                }
            }
        }
        selected.realX = (x - 1) * spaceSize;
        selected.realY=canvasHeight-y*spaceSize;
        */
        playerColor = Math.abs(1 - playerColor);
    }
    selected = 0;
}




function startUI(color = 0, time = 10 * 60, increment = 5){
    gameCanvas.start();
    board=new createBoard();
    pieces=new createPieces();
    timer = new createTimer(600, 0, 200, 100, time, increment);
    bg = new createBackground();
    notation = new createNotation(600, 100);
    gameCanvas.canvas.addEventListener('wheel', scrl);
    gameCanvas.canvas.addEventListener('click', click);
    
}

function click(event){
    //When you click
    if(playerColor == 0){

        for(let i = 0; i < pieces.whitePieces.length; i++){
            if(pieces.whitePieces[i].realX <= event.pageX &&
                pieces.whitePieces[i].realX + spaceSize > event.pageX &&
                pieces.whitePieces[i].realY <= (event.pageY - 100) &&
                pieces.whitePieces[i].realY + spaceSize > (event.pageY - 100)){
                selected = pieces.whitePieces[i];
                return;
            }
        }
        
    }else if(playerColor == 1){
        for(let i = 0; i < pieces.blackPieces.length; i++){
            if(pieces.blackPieces[i].realX <= event.pageX &&
                pieces.blackPieces[i].realX + spaceSize > event.pageX &&
                pieces.blackPieces[i].realY <= (event.pageY - 100) &&
                pieces.blackPieces[i].realY + spaceSize > (event.pageY - 100)){
                selected = pieces.blackPieces[i];
                return;
            }
        }
    }
    if(selected == 0){
        return;
    }
    if(event.pageX < 600){
        makeMove(Math.floor(event.pageX / spaceSize) + 1, 8 - Math.floor((event.pageY-100) / spaceSize));
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
        }
        for(let i=0;i<this.blackPieces.length;i++){
            this.blackPieces[i].draw();
        }
    }

    this.setPieces = function(fen){
        this.whitePieces=[];
        this.blackPieces=[];
        i = 0;
        xx = 1;
        yy = 8;
        while(i < fen.length){
            c = fen.charAt(i);
            if(!isNaN(c * 1)){
                xx += c - 1;
            }else if(c === '/'){
                yy--;
                xx = 0;
            }else if(c === ' '){
                break;
            }else{
                selCol = 'black';
                if (c == c.toUpperCase()) {
                    selCol = 'white';
                    if(c === 'P'){//Pawn
                        this.whitePieces.push(new createPawn(xx,yy,selCol));
                    }else if(c === 'N'){//Knight
                        this.whitePieces.push(new createKnight(xx,yy,selCol));
                    }else if(c === 'B'){//Bishop
                        this.whitePieces.push(new createBishop(xx,yy,selCol));
                    }else if(c === 'R'){//Rook
                        this.whitePieces.push(new createRook(xx,yy,selCol));
                    }else if(c === 'Q'){//Queen
                        this.whitePieces.push(new createQueen(xx,yy,selCol));
                    }else if(c === 'K'){//King
                        this.whitePieces.push(new createKing(xx,yy,selCol));
                    }
                }else{
                    if(c === 'p'){//Pawn
                        this.blackPieces.push(new createPawn(xx,yy,selCol));
                    }else if(c === 'n'){//Knight
                        this.blackPieces.push(new createKnight(xx,yy,selCol));
                    }else if(c === 'b'){//Bishop
                        this.blackPieces.push(new createBishop(xx,yy,selCol));
                    }else if(c === 'r'){//Rook
                        this.blackPieces.push(new createRook(xx,yy,selCol));
                    }else if(c === 'q'){//Queen
                        this.blackPieces.push(new createQueen(xx,yy,selCol));
                    }else if(c === 'k'){//King
                        this.blackPieces.push(new createKing(xx,yy,selCol));
                    }
                }
                
                
            }
            i++;
            xx++;
        }
    }
}

function createPawn(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "pawn";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_plt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_pdt60.png';
    }
    this.draw=function(){
        
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createKnight(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "knight";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_nlt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_ndt60.png';
    }
    this.draw=function(){
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createBishop(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "bishop";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_blt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_bdt60.png';
    }
    this.draw=function(){
        
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createRook(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "rook";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_rlt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_rdt60.png';
    }
    this.draw=function(){
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createQueen(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "queen";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_qlt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_qdt60.png';
    }
    this.draw=function(){
        
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
    }
}

function createKing(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.realX=(x-1)*spaceSize;
    this.realY=canvasHeight-y*spaceSize;
    this.type = "king";
    this.img = new Image();
    if(color==='white'){
        this.img.src='static/images/pieceIcons/white/Chess_klt60.png';
    }else{
        this.img.src='static/images/pieceIcons/black/Chess_kdt60.png';
    }
    this.draw=function(){
        
        ctx=gameCanvas.context;
        ctx.drawImage(this.img,this.realX,this.realY,spaceSize,spaceSize);
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
    
    this.movesWhite = [];
    this.movesBlack = [];
    this.scroll=0;
    
    this.h = canvasHeight - y;

    this.addScroll = function(dY){
        if(this.movesWhite.length < 1){
            return;
        }
        this.scroll += Math.sign(dY);
        this.scroll = Math.max(0, this.scroll);
        this.scroll = Math.min(this.movesWhite.length - 1, this.scroll)
    }
    this.addMove = function(text, white){
        if(white){
            this.movesWhite.push(text);
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
            ctx.fillText(this.movesWhite[i], x + 40, y + 25 + 25 * (i - this.scroll));
            ctx.textAlign = "right";
            if(this.movesBlack.length > i){
                ctx.fillText(this.movesBlack[i].padEnd(4), x + 200 - 20, y + 25 + 25 * (i - this.scroll));
            }
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
        this.minString = Math.floor(this.time / 60);
        this.secString = Math.floor(this.time) % 60;

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

    this.decrement = function(t){
        this.time -= t;
        //console.log(this.time);
    }
    //this.interval = setInterval(this.,20);
}

function updateCanvas(){
    switch(gameState){
        case 0:
            
            board.draw();
            if(selected != 0){
                ctx = gameCanvas.context;
                ctx.fillStyle = 'lawngreen';
                ctx.strokeRect(selected.realX, selected.realY, spaceSize, spaceSize);
            }
            pieces.draw();
            bg.draw();
            timer.draw();
            if(playerColor == chosenColor){
                timer.decrement(20 / 1000);
            }else if(computerMove == null){
                //computerMove = 'Nh6';
                computerMove = $.ajax({type: "GET", url: '/computerMove?fen='+fen+'&depth=0', async: false}).responseText;
                
            }else{
                notation.addMove(computerMove, Math.abs(1-playerColor));
                fen = $.ajax({type: "GET", url: '/getNewFenSan?fen='+fen+'&san='+computerMove, async: false}).responseText;
                
                pieces.setPieces(fen);
                computerMove = null;
                playerColor = Math.abs(1 - playerColor);
            }
            notation.draw();
            
            break;
    }
}