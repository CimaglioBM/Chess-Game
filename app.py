from distutils.log import debug
from flask import Flask, render_template, request

import scripts.chessHelper as cH
import os


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

@app.route('/getNewFenUci')
def newFenUci():
    return cH.getNewFenUci(**request.args)

@app.route('/getFenMoveStr')
def getFenMoveStr():
    return cH.getFenMoveStr(**request.args)

@app.route('/uciToAn0')
def uciToAn0():
    return cH.uciToAn0(**request.args)

@app.route('/uciToAn1')
def uciToAn1():
    return cH.uciToAn1(**request.args)

@app.route('/isMate')
def isMate():
    return cH.isMate(**request.args)

@app.route('/isStalemate')
def isStalemate():
    return cH.isStalemate(**request.args)

@app.route('/computerMove')
def computerMove():
    return cH.getComputerMove(**request.args)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/home', methods = ['POST'])
def make():
    if request.method == "POST":
        directory = request.form['account']
        par = request.form['path']
        path = os.path.join(par, directory)
        os.mkdir(path)
        return render_template('/home.html')
    
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