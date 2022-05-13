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
from scripts.Back_End.create_model import *
from scripts.Back_End.get_move_WHITE import *
from scripts.Back_End.get_move_BLACK import *

import chess
import sys
import random
import tensorflow as tf
import numpy as np

eval_dict = {
    1:"--",
    2:"-",
    3:"0",
    4:"+",
    5:"++",
}


#not to be used anymore
def readBoard(game_path):
    board = chess.Board()
    file = open(game_path, 'r')

    while (True):
        move = file.readline()

        if (not move): #there is no new line to get
            break #exit the loop

        try:
            board.push_san(move[0:-1])
            #print("move:", move)
        except:
            print("Stopped reading on invalid move:", move)
            print(" NOTE: If blank, it was probably an end line in the file")
    
    file.close()
    return board

#not to be used anymore
def updateBoardFile(game_path, next_move):
    board = chess.Board()
    file = open(game_path, 'a')
    
    file.writelines(next_move + '\n')
    
    file.close()
    return board

def readInputs(args):
    print("reading inputs")
    game = argv[1]
    depth = int(argv[2])
    white = int(argv[3])
    
    game_moves = game.split(",")
    
    board = chess.Board()
    
    for move in game_moves:
        try:
            board.push_san(move)
            print("move:", move)
        except:
            print("Stopped reading on invalid move:", move)
            print(" NOTE: If blank, it was probably an end line in the file")
        
    return board, depth, white
    #End of readInputs

def getNextMove(board, diff, white):
    if white:
        return get_next_move_WHITE(board, diff)
    else:
        return get_next_move_BLACK(board, diff)
    #End of getNextMove

def get_predicted_move(board, diff, white):

    #tf.get_logger().setLevel('INFO')

    print("Begin chess ai")
#    path = sys.argv[1]

    #argv[2] is the difficulty level
#    depth = int(sys.argv[2])
    
    #argv[3] is the player - white or black
#    if (sys.argv[3] == 'white'):
#        white = 1
#    else:
#        white = 0

#    board = readBoard(path)
#    board, depth, white = readInputs(args)

    #get the next move as a chess.move object
    uci_move,score = getNextMove(board.epd(), int(diff), int(white))
    
    #print the move
    print("Move:", uci_move)
    print("Tree Score:", score)
    
    try:
        board.push(uci_move)
        next_move = str(uci_move)
        #print("Move:", next_move)
    except:
        print("Something was wrong with the predicted move. Quitting...")
        sys.exit()
    
    #print("Board:")
    #print(board)
    #print(board.fen())
    #print("Move:", next_move)

    #updateBoardFile(path, next_move)
    
    print("*****************")
    print(score)
    print()
    score = round(score)
    score = eval_dict[score]
    print(score)
    print()
    
    print(score + '*' + next_move)
    return score + '*' + next_move


#if __name__ == '__main__':
#    next_move = get_predicted_fen(sys.argv)
#    print(next_move)

