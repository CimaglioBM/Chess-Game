//Defining Variables
var canvasWidth=800;
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
var moveSelect = 0;
var board;
var pieces;
var spaceSize=75;
var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var prevFen = "";
var playerColor = 0;
var aFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        
        var text = reader.result;
        var node = document.getElementById('output');
        //node.innerText = text;
        var s = text.split('\n');
        for(i = 0; i < s.length - 1; i++){
            console.log(s[i]);
            m = $.ajax({type: "GET", url: '/uciToAn1?fen='+fen+'&san='+(s[i]), async: false}).responseText, Math.abs(1-playerColor);
            notation.addMove(m, Math.abs(1-playerColor));
            fen = $.ajax({type: "GET", url: '/getNewFenUci?fen='+fen+'&uci='+s[i], async: false}).responseText;
            playerColor = Math.abs(1 - playerColor);
        }
        //console.log(reader.result.substring(0, 200));
        desc = new createDescription(600, 0, 200, 80);
        desc.analize(0);
    };
    reader.readAsText(input.files[0]);
    
};

function startUI(){
    
    gameCanvas.start();
    board=new createBoard();
    pieces=new createPieces();
    
    bg = new createBackground();
    notation = new createNotation(600, 80);
    gameCanvas.canvas.addEventListener('wheel', scrl);
    window.addEventListener("keydown", (event) =>{
        //console.log(`key=${event.key},code=${event.code}`);
        if(event.key === "ArrowRight"){
            forward();
        }else if(event.key === "ArrowLeft"){
            backward();
        }
    });
}

function forward(){
    moveSelect = Math.min(notation.movesWhite.length + notation.movesBlack.length, moveSelect + 1);
    updateBoard(moveSelect);
}

function backward(){
    moveSelect = Math.max(0, moveSelect - 1);
    updateBoard(moveSelect);
}

function updateBoard(a){//a = move number
    movestr = "";
    for(i = 1; i <= a; i++){
        if(i % 2 == 0){//even
            movestr += notation.movesBlack[(i / 2) - 1] + ",";
        }else{//odd
            movestr += notation.movesWhite[(i - 1) / 2] + ",";
        }
    }
    fen = $.ajax({type: "GET", url: '/getFenMoveStr?movestr='+movestr, async: false}).responseText;
    pieces.setPieces(fen);
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
        }
        for(let i=0;i<this.blackPieces.length;i++){
            this.blackPieces[i].draw();
        }
    }

    this.setPieces = function(fen){
        if(typeof fen != "string"){
            return;
        }
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
        this.scroll = Math.min(this.movesWhite.length - 1, this.scroll);
    }
    this.addMove = function(text, white){
        if(white){
            this.movesWhite.push(text);
            //this.movesBlack.length = this.movesWhite.length;
        }else{
            this.movesBlack.push(text);
        }
    }
    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.font="Bold 20px arial";
        for(let i = this.scroll; i < this.movesWhite.length; i++){
            ctx.font =  this.f;
            if(Math.floor((moveSelect - 1) / 2) == i){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            
            ctx.textAlign = "left";
            ctx.fillText((i + 1).toString() + ":", x + 10, y + 25 + 25 * (i - this.scroll));

            if((moveSelect - 1) == i * 2){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            ctx.fillText(this.movesWhite[i], x + 40, y + 25 + 25 * (i - this.scroll));

            if((moveSelect - 2) == i * 2){
                ctx.fillStyle = 'white';
            }else{
                ctx.fillStyle = 'silver';
            }
            ctx.textAlign = "right";
            if(this.movesBlack.length > i){
                ctx.fillText(this.movesBlack[i].padEnd(4), x + 200 - 20, y + 25 + 25 * (i - this.scroll));
            }
        }
    }
}

function createBackground(){
    this.draw = function(){
        ctx = gameCanvas.context;

        ctx.fillStyle = lineColor;
        ctx.fillRect(600, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#181818';
        ctx.fillRect(600+lineWidth, lineWidth, canvasWidth - lineWidth * 2, canvasHeight - lineWidth * 2);
    }
}

function createDescription(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.opening = "Sicilian Defense: Delayed Alapin Variation";
    
    this.eval = 0.5;
    this.whiteEvals=[];
    this.blackEvals=[];
    this.whiteMoveRec=[];
    this.blackMoveRec=[];
    for(i = 0; i < notation.movesWhite.length + 1; i++){
        this.whiteEvals[i]="";
        this.whiteMoveRec[i]="";
    }
    for(i = 0; i < notation.movesBlack.length + 1; i++){
        this.blackEvals[i]="";
        this.blackMoveRec[i]="";
    }
    
    
    p = 0;
    
    
    
    this.analize = function(mn){
        if(mn < notation.movesBlack.length + notation.movesWhite.length){
            mmstr = "";
            //mmstr = notation.movesWhite[0] + ',';
            for(po = 0; po < mn; po++){
                if(po % 2 == 0){//white
                    mmstr += notation.movesWhite[Math.floor(po / 2)] + ',';
                }else{
                    mmstr += notation.movesBlack[Math.floor(po / 2)] + ',';
                }
            }
        }else{
            return;
        }
        aFen = $.ajax({type: "GET", url: '/getFenMoveStr?movestr='+mmstr, async: false}).responseText;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", '/computerOpinion?fen='+aFen+'&color='+ (p % 2) + '&depth=0&moveNum=' + mn, true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    for(pop = 0; pop < xhr.responseText.length; pop++){
                        if(xhr.responseText.charAt(pop) === ','){
                            mmmn = Number(xhr.responseText.charAt(pop + 1));
                            break;
                        }
                    }
                    if((mmmn + 1) % 2 == 0){
                        pop = 0;
                        while(!(xhr.responseText.charAt(pop) === '[')){
                            desc.whiteEvals[Math.floor((mmmn + 1) / 2)] += xhr.responseText.charAt(pop++);
                        }
                        pop++;
                        while(!(xhr.responseText.charAt(pop) === ',')){
                            desc.whiteMoveRec[Math.floor((mmmn + 1) / 2)] += xhr.responseText.charAt(pop++);
                        }
                        
                    }else{
                        pop = 0;
                        while(!(xhr.responseText.charAt(pop) === '[')){
                            desc.blackEvals[Math.floor((mmmn + 1) / 2)] += xhr.responseText.charAt(pop++);
                        }
                        pop++
                        while(!(xhr.responseText.charAt(pop) === ',')){
                            desc.blackMoveRec[Math.floor((mmmn + 1) / 2)] += xhr.responseText.charAt(pop++);
                        }
                        //desc.blackMoveRec[Math.floor(mn / 2)] = $.ajax({type: "GET", url: '/uciToAn1?fen='+aFen+'&san='+(desc.whiteMoveRec[Math.floor(mn / 2)]), async: false}).responseText;
                    }
                    desc.analize(mn + 1);
                } else {
                    console.error(xhr.statusText);
                }
            }
            };
            xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
        
    }
    
    
    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.fillStyle = lineColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.moveRec = "";
        this.eval = "";
        if(moveSelect > 0){
            if(moveSelect % 2 == 0){
                this.moveRec = this.whiteMoveRec[Math.floor(moveSelect / 2)];
            }else{
                this.moveRec = this.blackMoveRec[Math.floor(moveSelect / 2)];
            }
            if(this.moveRec == ""){
                this.moveRec = "Wait..";
            }

            if(moveSelect % 2 == 0){
                this.eval = this.whiteEvals[Math.floor(moveSelect / 2)];
            }else{
                this.eval = this.blackEvals[Math.floor(moveSelect / 2)];
            }
            if(this.eval == ""){
                this.eval = "Wait..";
            }
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + lineWidth, this.y + lineWidth, this.width - lineWidth * 2, this.height - lineWidth * 2);


        ctx.textAlign = "left";
        ctx.font="Bold 10px arial";

        ctx.fillStyle = '#505050';
        ctx.strokeText(this.opening.substr(0, 32) + "...", x + 10 + 2, y + 70 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText(this.opening.substr(0, 32) + "...", x + 10, y + 70);


        ctx.font="Bold 20px arial";
        ctx.fillStyle = '#505050';
        ctx.strokeText("Best Move: " + this.moveRec, x + 10 + 2, y + 25 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText("Best Move: " + this.moveRec, x + 10, y + 25);

        ctx.fillStyle = '#505050';
        ctx.strokeText("Evaluation: " + this.eval, x + 10 + 2, y + 50 + 2);

        ctx.fillStyle = 'white';
        ctx.fillText("Evaluation: " + this.eval, x + 10, y + 50);
        //cutoff
        ctx.fillStyle = lineColor;
        ctx.fillRect(this.width - lineWidth+600, this.y, lineWidth, canvasHeight);

        
    }
}

function updateCanvas(){
    switch(gameState){
        case 0:
            board.draw();
            pieces.draw();
            bg.draw();
            desc.draw();
            notation.draw();
            break;
    }
}