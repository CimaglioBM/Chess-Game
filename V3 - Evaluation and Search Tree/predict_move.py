# Input -> text file containing all moves in a game (which can be empty!), save a new move to the file
#
# This is the AI file, and what you want to call using the game for the white player
#
# Author - Connor Kamrowski
#
#
# TODO:
#   When the board can't predict beyond a depth, it will crash
#           i.e. -> the next legal move is checkmate, it will try to find legal moves beyond that checkmate.
#           add a check for this, easy to do! Just return high score if checkmate is on white's turn


#local libraries
from create_model import *
from get_move_WHITE import *
from get_move_BLACK import *

import chess
import sys
import random
import tensorflow as tf
import numpy as np



def readBoard(game_path):
    board = chess.Board()
    file = open(game_path, 'r')

    while (True):
        move = file.readline()

        if (not move): #there is no new line to get
            break #exit the loop

        try:
            board.push_san(move[0:-1])
            print("move:", move)
        except:
            print("Stopped reading on invalid move:", move)
            print(" NOTE: If blank, it was probably an end line in the file")
    
    file.close()
    return board

def updateBoardFile(game_path, next_move):
    board = chess.Board()
    file = open(game_path, 'a')
    
    file.writelines(next_move + '\n')
    
    file.close()
    return board


def getNextMove(board, depth, white):
    if white:
        return get_next_move_WHITE(board, depth)
    else:
        return get_next_move_BLACK(board, depth)

    #End of getNextMove


def main(args):

    #tf.get_logger().setLevel('INFO')

    print("Begin chess ai")
    path = sys.argv[1]

    #argv[2] is the difficulty level
    depth = int(sys.argv[2]) * 3
    
    #argv[3] is the player - white or black
    if (sys.argv[3] == 'white'):
        white = 1
    else:
        white = 0

    board = readBoard(path)

    #get the next move as a chess.move object
    uci_move,score = getNextMove(board.epd(), depth, white)
    
    #print the move
    print("Move:", uci_move)
    print(type(uci_move))
    print("Score:", score)
    
    try:
        board.push(uci_move)
        next_move = str(uci_move)
        print("Move:", next_move)
    except:
        print("Something was wrong with the predicted move. Quitting...")
        sys.exit()
    
    print("Board:")
    print(board)
    print("Move:", next_move)

    updateBoardFile(path, next_move)
    
    print("done!")


if __name__ == '__main__':
    main(sys.argv)

