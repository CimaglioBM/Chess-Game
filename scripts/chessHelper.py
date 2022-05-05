import chess
import random

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

def getNewFenSan(fen, san):
    b = chess.Board(fen)
    b.push_san(san)
    return b.fen()


def uciToAn(fen, moveStart, moveEnd):
    b = chess.Board(fen)
    return b.san(chess.Move.from_uci(moveStart+moveEnd))

def uciToAn(fen, san):
    b = chess.Board(fen)
    return b.san(chess.Move.from_uci(san))

def getComputerMove(fen, depth):
    b = chess.Board(fen)
    legal_moves = str(b.legal_moves)[38:-2].replace(',','').split()
    
    #move_index = random.randint(0,len(legal_moves))
    #print(legal_moves[0])
    return legal_moves[0]
    