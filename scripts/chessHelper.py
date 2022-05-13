from tokenize import String
import chess
from scripts.Back_End.predict_move import *

def moveLegal(fen, moveStart, moveEnd):
    b = chess.Board(fen)
    if(chess.Move.from_uci(moveStart+moveEnd) in b.legal_moves):
        return "true"
    else:
        return "false"


def getNewFen(fen, moveStart, moveEnd):
    b = chess.Board(fen)
    b.push_uci(moveStart+moveEnd)
    return b.fen()

def isMate(fen):
    b = chess.Board(fen)
    if(b.is_checkmate()):
        return "True"
    else:
        return "False"

def getComputerOpinion(fen, color, depth, moveNum):
    return "++" + '[' + uciToAn1(fen, getComputerMove(fen, color, depth)) + ',' + str(moveNum)


def getNewFenSan(fen, san):
    b = chess.Board(fen)
    b.push_san(san)
    return b.fen()

def getNewFenUci(fen, uci):
    b = chess.Board(fen)
    b.push_uci(uci)
    return b.fen()


def getFenMoveStr(movestr):
    moveList = movestr.split(",")
    b = chess.Board()
    for a in moveList:
        a = a.replace(' ','+')
        if(a == ''):
            break
        b.push_san(a)
    return b.fen()

def isStalemate(fen):
    b = chess.Board(fen)
    if(b.is_stalemate()):
        return "True"
    else:
        return "False"

def uciToAn0(fen, moveStart, moveEnd):
    b = chess.Board(fen)
    return b.san(chess.Move.from_uci(moveStart+moveEnd))

def uciToAn1(fen, san):
    b = chess.Board(fen)
    return b.san(chess.Move.from_uci(san))

def getComputerMove(fen = "", color = 1, depth = 0):
    b = chess.Board(fen)
    
    return get_predicted_move(b, depth, color)
    