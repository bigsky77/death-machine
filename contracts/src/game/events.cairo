//////////////////////////////////////////////////////////////
//                          EVENTS
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.dict_access import DictAccess
from src.game.spaceships import InputShipState, ShipState
from src.board.gameboard import SingleBlock 


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
func gameComplete(ships_len: felt, ships: ShipState*){

  }

@event
func boardComplete(board_len: felt, board: SingleBlock*){

  }
