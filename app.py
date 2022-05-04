from distutils.log import debug
from flask import Flask, render_template, request

import scripts.chessHelper as cH


app = Flask(__name__)

@app.route('/legalMoves')
def legalMoves():
    return cH.moveLegal(**request.args)

@app.route('/getNewFen')
def newFen():
    return cH.getNewFen(**request.args)
    
@app.route('/getNewFenSan')
def newFenSan():
    return cH.getNewFenSan(**request.args)

@app.route('/uciToAn')
def uciToAn():
    return cH.uciToAn(**request.args)

@app.route('/computerMove')
def computerMove():
    return cH.getComputerMove(**request.args)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/starterPage.html')
def startgame():
    return render_template('starterPage.html')

@app.route('/game.html')
def game():
    return render_template('/game.html')

@app.route('/analysisBoard.html')
def analysis():
    return render_template('/analysisBoard.html')

@app.route('/home.html')
def back():
    return render_template('home.html')
    
if __name__ == '__main__':
    app.run(debug=True)