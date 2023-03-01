//////////////////////////////////////////////////////////////
//                          EVENTS
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.dict_access import DictAccess
from src.spaceships import InputShipState, ShipState
from src.types import Grid, Star, Enemy, Spaceship, Planet, GameBoard 

@event
func boardSet(star_array_len: felt, star_array: Star*, enemy_array_len: felt, enemy_array: Enemy*, planet_array_len, planet_array: Planet*, player_address: felt){

  }

@event
func simulationSubmit(instructions_len: felt, instructions: felt*, spaceships_len: felt, spaceships: InputShipState*, player_address: felt){

  }

@event
func turnComplete(spaceships_len: felt, spaceships: DictAccess*){

  }

@event
func simulationComplete(){

  }

@event
func shipMoved(ship: ShipState){

  }
