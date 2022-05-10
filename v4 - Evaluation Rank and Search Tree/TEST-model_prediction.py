#Test the model predictions, see how they line up with the actual data
# the accuracy is so poor, I have to assume it's relatively accurate but reported to be poor

import chess
import sys
import tensorflow as tf
import numpy as np
import csv
import matplotlib.pyplot as plt


from parse_board import *
from create_model import *

DATA_SIZE = 200

def parseEval(evaluation):
    if evaluation < -60:
        evaluation = -60
    elif evaluation > 300:
        evaluation = 300

    evaluation += 60
    
    ranked_eval = round(evaluation/72)

    return ranked_eval
#    return ranked_eval


def CSVtoDataset(path):
    print("CSV to board time")
    
    X = []
    Y = []
    
    with open(path, newline='') as data_file:
        reader = csv.reader(data_file)
        
        #print the header of the file, then continue
        for the_first in reader:
            print("File Header: ",the_first)
            break

        counter=0
        for fen, evaluation in reader:
            if counter < DATA_SIZE*1000:
                counter+=1
                continue
            if counter == DATA_SIZE*1000+DATA_SIZE*5:
                break
            counter+=1
            #print(fen)
            #print(evaluation)
            #print()
            
            board_mat = FENtoBoard(fen)
            
            #print(board_mat)
            #print(evaluation)
            
            while (not evaluation[0].isnumeric()):
                evaluation = evaluation[1:]
                #print("FIXEL EVAL:")
                #print(evaluation)
                #print(evaluation)
            
            X.append(board_mat)
            evaluation = parseEval(int(evaluation))
            Y.append(evaluation)
            

    X = np.asarray(X)
    X = np.expand_dims(X, axis=-1)
    
    Y = np.asarray(Y)
    print()
    print("Min and max of Y:")
    print(np.min(Y))
    print(np.max(Y))

    print()
    print("Done with CSV to board!")
    return X, Y

def main(args):

    print("start")

    data_path = "Training_Data/chessData.csv"
    
    # load the csv, and translate everything to a dataset of boards and evaluations
    boards, evaluations = CSVtoDataset(data_path)
    #X, Y

    model = createModel()
    model.load_weights('Output/model_weights.h5')


    preds = np.squeeze(model.predict(boards), axis=-1)
    preds[preds > 300] = 300
    evaluations[evaluations > 300] = 300
    
    if 0:
        for i in range(DATA_SIZE):
            board = boards[i]
            #parse the board to model format
            #parsed_board = BoardtoNumeric(board)

            #predict on parsed board
            prediction = preds[i]

            print("Iteration:", i)
            print(" *    Actual:", evaluations[i])
            print(" * Predicted:", prediction)
            print()

    print(evaluations.shape)
    print(preds.shape)
    plt.plot(evaluations)
    plt.plot(preds)
    #plt.hist((evaluations, preds), density=True, histtype='bar', label=("evals", "preds"))
    plt.show()
    #End of main
    
    plt.plot(evaluations - preds)
    plt.show()

if __name__ == '__main__':
    main(sys.argv)

