# Input -> a board, and a depth to search to
# Output -> a move to make, and its score in a list format
#           i.e. -> [move, score]
#           NOTE: MOVE IS OF TYPE chess.move, not a string!
#               example: [e2e4, 233]
#
#
# Author - Connor Kamrowski
# 

from parse_board import *
from create_model import *

import chess
import sys
import random
import tensorflow as tf
import numpy as np

#Constants
CHECKMATE_PRIORITY = 300

#eval()
def pred_eval(board):
    #load the model (hard code this path, it will never change)

    model = createModel()
    model.load_weights("Output/model_weights.h5")

    #parse the board to model format
    board_for_model = []
    
    parsed_board = BoardtoNumeric(board)

    board_for_model.append(parsed_board)
    board_for_model = np.asarray(board_for_model)

    board_for_model = np.expand_dims(board_for_model, axis=-1)


    #predict on parsed board
    prediction = model.predict(board_for_model)

    return prediction[0]
    #End of pred_eval
    

#X()
def get_score(board, depth, curr):
    #get the legal moves
    legal_moves = list(board.legal_moves)
    score = 0
    if curr >= depth:
        #print(board.fen())
        print()
        print(legal_moves)
        for move in legal_moves:
            last_board = chess.Board(board.fen())

            last_board.push(move)

            evaluation = pred_eval(last_board)

            score += evaluation
            print("score")

        return score
    else: #keep searching the tree!
        curr += 1
        for move in legal_moves:
            next_board = chess.Board(board.fen())
            next_board.push(move)
            if next_board.is_checkmate():
                score+=CHECKMATE_PRIORITY
            else:
                score += get_score(next_board, depth, curr)
        return score
    
    #End of get_score


#Y()
def get_next_move_BLACK(state, depth=3):
    print("Depth to search:", depth)
    original_board = chess.Board(state)
    #get the legal moves
    legal_moves = list(original_board.legal_moves)
    #initialize scores array
    scores = []
    
    #for each LM
    for i in range(len(legal_moves)):
        LM = legal_moves[i]
        board = chess.Board(original_board.fen())
        board.push(LM)
        if board.is_checkmate():
            return (LM, 99999)#the game is won, this next move creates checkmate

        LM_score = get_score(board, depth, 1)
        
        scores.append( (LM, LM_score) )
        #end for loop
    
    best = scores[0]
    
    for move, score in scores:
        if score < best[1]:
            best = (move, score)
        #end for loop
        
    print("The best move:", best[0], best[1])

    return best
    #End of get_next_move

