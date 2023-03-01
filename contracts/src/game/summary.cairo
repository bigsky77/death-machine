//////////////////////////////////////////////////////////////
//                     SUMMARY 
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write, dict_read

from src.game.spaceships import ShipState
from src.game.types import Grid

func turn_summary{syscall_ptr: felt*, range_check_ptr}(ships_len: felt, 
    ships: ShipState*, i: felt, ship_dict: DictAccess*) -> (ships_len: felt, ships:ShipState*){
    alloc_locals;
    
    let (all_ships: ShipState*) = alloc();

    if(i == ships_len){
        return(ships_len, ships);
      }

    let (ptr) = dict_read{dict_ptr=ship_dict}(key=i);
    tempvar ship: ShipState* = cast(ptr, ShipState*);  
    assert all_ships = ship;

    return turn_summary(ships_len, all_ships, i + 1, ship_dict);
  }
