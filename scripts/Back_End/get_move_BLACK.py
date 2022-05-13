# Input -> a board, and a depth to search to
# Output -> a move to make, and its score in a list format
#           i.e. -> [move, score]
#           NOTE: MOVE IS OF TYPE chess.move, not a string!
#               example: [e2e4, 233]
#
#
# Author - Connor Kamrowski
# 

from scripts.Back_End.parse_board import *
from scripts.Back_End.create_model import *

import chess
import sys
import random
import tensorflow as tf
import numpy as np
import random
import os

#Constants


#eval()
def pred_eval(model, board):

    #parse the board to model format
    board_for_model = []
    
    parsed_board = BoardtoNumeric(board)

    board_for_model.append(parsed_board)
    board_for_model = np.asarray(board_for_model)

    board_for_model = np.expand_dims(board_for_model, axis=-1)

    #predict on parsed board
    prediction = model.predict(board_for_model)[0]
    
    #multi-class prediction handling
    pred_class = 0
        
    for i in range(len(prediction)):
        if prediction[i] > prediction[pred_class]:
            pred_class = i
        
    pred_class += 1

    randomness = (random.randint(1,10)-5)/20
    
    if pred_class + randomness > 5 or pred_class < 0.5:
        varied_pred = pred_class - randomness
    else:
        varied_pred = pred_class + randomness
    
    return varied_pred
    #End of pred_eval
    

def get_initial_layer_move(board, model, simple=1):
    legal_moves = list(board.legal_moves)
    if simple:
        best_move = legal_moves[0]
        score = 100
        for each in legal_moves:
            board_copy = chess.Board(board.fen())
            board_copy.push(each)

            curr_score = pred_eval(model, board_copy)#model.predict(processed_board)

            if curr_score < score:
                best_move = each
                score = curr_score
        return best_move, score
    else:
        moves = []
        scores = []
        for each in legal_moves:
            board_copy = chess.Board(board.fen())
            board_copy.push(each)
            
            processed_board = BoardtoNumeric(board_copy)
            
            curr_score = pred_eval(model, board_copy)#model.predict(processed_board)
            
            moves.append(each)
            scores.append(curr_score)
            
        moves = np.asarray(moves)
        scores = np.asarray(scores)
        if len(moves) > 5:
            scores_indexes = scores.argsort()
            #scores = scores[scores_indexes[0:5]]
            moves = moves[scores_indexes[0:5]]

        return moves


def evaluate_some_moves(board, model, simple=1):
    legal_moves = list(board.legal_moves)

    #look at no more than ten of the moves
    if len(legal_moves) > 10:
        legal_moves = legal_moves[0:10]

    if simple:
        score = 0
        for each in legal_moves:
            board_copy = chess.Board(board.fen())
            board_copy.push(each)
            
            score += pred_eval(model, board_copy)#model.predict(processed_board)
        
        #get the average score across the moves
        if len(legal_moves) > 0:
            score = score/len(legal_moves)
        return score
    else:
        score = 0
        for each in legal_moves:
            board_copy = chess.Board(board.fen())
            board_copy.push(each)
            
            score += evaluate_some_moves(board_copy, model)
        
        #get the average score across the moves
        if len(legal_moves) > 0:
            score = score/len(legal_moves)
        return score


#Y()
def get_next_move_BLACK(state, diff=2):
    print("Difficulty:", diff)
    original_board = chess.Board(state)
    #get the legal moves
    legal_moves = list(original_board.legal_moves)
    #initialize scores array
    scores = []

    #load the model (hard code this path, it will never change)
    model = createModel()
    model.load_weights(os.getcwd()+"\scripts\Back_End\Output\model_weights.h5")
        
    if diff == 0 or diff > 2: #don't allow any difficulty over hard, stick them at easy
        move, score = get_initial_layer_move(original_board, model)
        return move, score

        #End of easy
    elif diff == 1:
        print("diff is normal")
        best_moves = get_initial_layer_move(original_board, model, 0)
        best_move = best_moves[0]
        best_score = 100
        for i in range(len(best_moves)):
            #get the current board
            curr_board = chess.Board(original_board.fen())
            #push the current move
            curr_board.push(best_moves[i])
            #get the score of this path
            current_score = evaluate_some_moves(curr_board, model)
            
            #if the score of this path is better, set this to best move
            if current_score < best_score:
                best_score = current_score
                best_move = best_moves[i]

        return best_move, best_score
        #End of normal
    else:
        best_moves = get_initial_layer_move(original_board, model, 0)
        best_move = best_moves[0]
        best_score = 100
        for i in range(len(best_moves)):
            #get the current board
            curr_board = chess.Board(original_board.fen())
            #push the current move
            curr_board.push(best_moves[i])
            #get the score of this path
            current_score = evaluate_some_moves(curr_board, model, 0)
            
            #if the score of this path is better, set this to best move
            if current_score < best_score:
                best_score = current_score
                best_move = best_moves[i]

        return best_move, best_score
        #End of hard

    #End of get_next_move

