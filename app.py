from distutils.log import debug
from flask import Flask, render_template

app = Flask(__name__)

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