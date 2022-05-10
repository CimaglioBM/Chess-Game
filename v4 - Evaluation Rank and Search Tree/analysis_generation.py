#
#
# Connor - write this header later lol, I hope nobody ever reads this...
#
#

import chess
import sys
import tensorflow as tf
import numpy as np
import csv

#local files included
from create_model import *
from get_move_WHITE import *
from get_move_BLACK import *

def getGameMoves(path):
    board = chess.Board()
    file = open(path, 'r')
    
    moves = []

    while (True):
        move = file.readline()

        if (not move): #there is no new line to get
            break #exit the loop

        try:
            board.push_san(move[:-1])
            moves.append(move[:-1])
            print("move:", move[:-1])
        except:
            print("Stopped reading on invalid move:", move)
            print(" NOTE: If blank, it was probably an end line in the file")
    
    file.close()
    return moves
    #End of getGameMoves

def convertAnalysis(analysis):
    print("Analysis:", analysis)
    
    if analysis <= 1:
        rank = "--"
    elif analysis <= 2:
        rank = "-"
    elif analysis <= 3:
        rank = "0"
    elif analysis <= 4:
        rank = "+"
    else:
        rank = "++"
    
    return rank

def performAnalysis(moves, path):
    print("Begin analysis")

    model_weight_path = "Output/model_weights.h5"

    #load the model
    model = createModel()
    model.load_weights(model_weight_path)
    
    reccommended = []
    analysis = []
    
    board = chess.Board()
    
    white = 1
    for move in moves:
        if(white):
            white = 0
            best_move = get_next_move_WHITE(board.epd(), 0)
            print("white")
        else:#black plays
            white = 1
            best_move = get_next_move_BLACK(board.epd(), 0)
            print("black")

        #put the actual move on the board
        board.push_san(move)
        #evaluate the given move
        evaluation = convertAnalysis(pred_eval(model, board))

        #add to the arrays
        reccommended.append(best_move[0])
        analysis.append(evaluation)
        
    #send the information to the file (and overwrite the existing info)
    file = open(path, 'w')
    for i in range(len(moves)):
        file.writelines(moves[i] + '\n')
        file.writelines(str(reccommended[i]) + '\n')
        file.writelines(analysis[i] + '\n')
    
    file.close()    
    
    #End of performAnalysis


def main(args):

    print("Begin analysis generation")

    game = sys.argv[1]    

#    game_moves = getGameMoves(game_path)
    game_moves = game.split(",")
    
    print(game_moves)
    
    performAnalysis(game_moves, game_path)    
    
    #End of main


if __name__ == '__main__':
    main(sys.argv)
    print("done")

