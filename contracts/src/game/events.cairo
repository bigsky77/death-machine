//////////////////////////////////////////////////////////////
//                          EVENTS
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.dict_access import DictAccess
from src.game.spaceships import InputShipState, ShipState
from src.game.types import Grid, Star, Enemy, Planet, GameBoard 
from src.board.gameboard import SingleBlock 

@event
func newBoard(board_len: felt, board: SingleBlock*){

  }


@event
func simulationSubmit(instructions_len: felt, instructions: felt*, spaceships_len: felt, spaceships: InputShipState*, player_address: felt){

  }

@event
func turnComplete(spaceships_len: felt, spaceships: ShipState*){

  }

@event
func simulationComplete(){

  }

@event
func shipMoved(ship: ShipState){

  }
