#
# This is a testing code - it reads in a game from a file, pushes the moves, and 'predicts' the next move.
#   A move 'prediction' is literally just a random move that is legal..
#

import chess
import sys
import random

def readBoard(game_path):
    board = chess.Board()
    file = open(game_path, 'r')

    while (True):
        move = file.readline()

        if (not move): #there is no new line to get
            break #exit the loop

        print("move:", move)
        board.push_san(move[0:-1])
    
    file.close()
    return board

def updateBoardFile(game_path, next_move):
    board = chess.Board()
    file = open(game_path, 'a')
    
    file.writelines(next_move + '\n')
    
    file.close()
    return board


def getNextMove(board):
    legal_moves = str(board.legal_moves)[38:-2].replace(',','').split()
    
    move_index = random.randint(0,len(legal_moves))
    
    return legal_moves[move_index]


def main(args):
    print("Begin chess ai")
    path = sys.argv[1]

    board = readBoard(path)
    
    next_move = getNextMove(board)
    
    print(next_move)
    print(type(next_move))
    
    try:
        board.push_san(next_move)
        print("Move:", next_move)
    except:
        print("Something was wrong with the predicted move. Quitting...")
        print("Board:")
        print(board)
        print("Move:", next_move)
        sys.exit()
    
    updateBoardFile(path, next_move)
    
    print("done!")


if __name__ == '__main__':
    main(sys.argv)

