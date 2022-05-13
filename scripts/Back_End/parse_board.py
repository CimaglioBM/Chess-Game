#https://stackoverflow.com/questions/55876336/is-there-a-way-to-convert-a-python-chess-board-into-a-list-of-integers
import chess
import numpy as np
import sys

white_piece_key = {
    80:0,  #pawns
    82:1,  #rooks
    78:2,  #knights
    66:3,  #bishops
    81:4,  #queen(s)
    75:5   #king
}

black_piece_key = {
    112:0, #pawns
    114:1, #rooks
    110:2, #knights (horsey)
    98:3,  #bishops
    113:4, #queen(s)
    107:5  #king
}

def charToNumerics(array, white):
    #convert the board from chars to ints (for DL model)
    array = array.view(np.int32)
    
    piece_boards = np.zeros((6, 8, 8))
    piece_boards.fill(0)

    for x in range(8):
        for y in range(8):
            if array[x][y] != 46:
                #print(array[x][y])
                if(white):
                    index = white_piece_key[array[x][y]]
                    piece_boards[index][x][y] = 1
                else:
                    index = black_piece_key[array[x][y]]
                    piece_boards[index][x][y] = 1

    #normalize to the same range every time
    #diff=114
    #array = (array-np.min(array))/diff
    
    #print()
    #print(array)
    #print()
    #for i in range(len(piece_boards)):
        #each = piece_boards[i]
        #print("On number:", i)
        #print(each)
        #print()
    
    #sys.exit()
    return piece_boards

def charToNumeric(array):
    #convert the board from chars to ints (for DL model)
    array = array.view(np.int32)

    #normalize to the same range every time
    diff=114
    array = (array-np.min(array))/diff
    return array
    

def getAttackedPositions(arr):
    attacks = np.zeros((8,8), int)
    attacks.fill(0)
    i = 0
    for x in range(8):
        for y in range(8):
            while(arr[i][0] != "1" and arr[i][0] != "."):
                i+=1
            if(arr[i] == "1"):
                attacks[x][y] = 1
            i+=1
    return attacks

def getAttacks(board, pieces, color):
    attacks = np.zeros((8,8), int)
    attacks.fill(0)
    board.turn = chess.WHITE

    current = 0
    for each in chess.SQUARES:
        if board.color_at(each) != color:
            continue
        #x=each%8
        #y=7-int(each/8)
        #attacks[y][x] += board.is_attacked_by(color, each)
        
        attacked = str(board.attacks(each))
        #print(attacked)
        final = getAttackedPositions(attacked)
        #print(final)
        attacks += final
        #print()

    
    #print()
    #print()
    #print()
    #print()
    #print(attacks)
    #print(board)
    return attacks


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
    
    black = np.zeros((8,8), str)
    black.fill('.')
    white = np.copy(black)
        
    for letter in range(8):
        for number in range(8):
            piece = foo[letter][number]
            if piece.isupper():
                white[letter][number] = piece
            else:
                black[letter][number] = piece

    white_attacks = getAttacks(board, charToNumeric(white), chess.WHITE)
    black_attacks = getAttacks(board, charToNumeric(black), chess.BLACK)
    
    black_boards = charToNumerics(black, 0)
    white_boards = charToNumerics(white, 1)
    
    final_array = np.stack((black_boards[0], black_boards[1], black_boards[2], black_boards[3], black_boards[4], black_boards[5], black_attacks, 
        white_boards[0], white_boards[1], white_boards[2], white_boards[3], white_boards[4], white_boards[5], white_attacks))
    #print(final_array)
    #print("Shape of final:", final_array.shape)
    #sys.exit()
    
    #print(foo)
    #print()
    if 0:
        print()
        print(black)
        print()
        print(white)
        print()
        print()
        print(black_attacks)
        print()
        print(white_attacks)
        sys.exit()
    return final_array


def BoardtoNumeric(board):
    return FENtoBoard(board.fen())

def parseEval(evaluation):
    if evaluation < -60:
        evaluation = -60
    elif evaluation > 300:
        evaluation = 300

    evaluation += 60
    
    rank = round(evaluation/72)
    #return rank
    ranked_eval = [0, 0, 0, 0, 0]
    ranked_eval[rank-1] = 1
    #print(ranked_eval)

    return ranked_eval
#    return ranked_eval

