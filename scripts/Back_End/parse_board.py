#https://stackoverflow.com/questions/55876336/is-there-a-way-to-convert-a-python-chess-board-into-a-list-of-integers
import chess
import numpy as np

def FENtoBoard(fen):

    board = chess.Board(fen)

    pgn = board.epd()
    foo = []  #Final board
    pieces = pgn.split(" ", 1)[0]
    rows = pieces.split("/")
    for row in rows:
        foo2 = []  #This is the row I make
        for thing in row:
            if thing.isdigit():
                for i in range(0, int(thing)):
                    foo2.append('.')
            else:
                foo2.append(thing)
        foo.append(foo2)
    #return foo
    #foo is now the board

    foo = np.asarray(foo)

    #convert the board from chars to ints (for DL model)
    foo = foo.view(np.int32)
    
    return foo


def BoardtoNumeric(board):
    return FENtoBoard(board.fen())


def parseEval(evaluation):
    if evaluation > 300:
        evaluation = 300
    elif evaluation < -300:
        evaluation = -300
    
    output = (evaluation-150) / (150)
    return output

