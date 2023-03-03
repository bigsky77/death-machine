//////////////////////////////////////////////////////////////
//                      SPACESHIPS
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write, dict_read

from src.game.types import Grid 
from src.game.constants import ns_ships, ns_instructions, ns_dict
from src.utils.utils import cords_to_index 
from src.board.gameboard import SingleBlock

struct InputShipState {
    id: felt,
    type: felt,
    status: felt,
    index: Grid,
    description: felt,
}

struct ShipState {
    id: felt,
    type: felt,
    status: felt,
    index: Grid,
    pc: felt,
}

func init_ships{range_check_ptr}(
    ships_count: felt, 
    ships: InputShipState*, 
    dict: DictAccess*, 
    dimension: felt
) -> (dict_new: DictAccess*) {
    
    if (ships_count == 0) {
        return (dict_new=dict);
    }

    tempvar ship: InputShipState = [ships];

    let (ptr) = dict_read{dict_ptr=dict}(key=ship.id);
    with_attr error_message("ids must be different") {
        assert ptr = 0;
    }

    with_attr error_message("ship not within bounds") {
        assert [range_check_ptr] = dimension - ship.index.x - 1;
        assert [range_check_ptr + 1] = dimension - ship.index.y - 1;
    }
    let range_check_ptr = range_check_ptr + 2;

    tempvar new_ship: ShipState* = new ShipState(ship.id, ship.type, ship.status, ship.index, 0);

    dict_write{dict_ptr=dict}(key=ship.id, new_value=cast(new_ship, felt));

    return init_ships(ships_count - 1, ships + ns_ships.INPUT_SHIP_SIZE, dict, dimension);
}

func iterate_ships{range_check_ptr}(
    board_dimension: felt,
    ships_dict: DictAccess*,
    board_dict: DictAccess*,
    i: felt,
    instructions_len: felt,
    instructions: felt*,
) -> (ships_new: DictAccess*, board_updated: DictAccess*){
  alloc_locals;
  
  if(instructions_len == i) {
        return (ships_new=ships_dict, board_updated=board_dict);
    }

  tempvar instruction = [instructions + i];
  let (ptr) = dict_read{dict_ptr=ships_dict}(key=i);
  tempvar ship = cast(ptr, ShipState*);
  
  let can_move_right = is_le(ship.index.x, board_dimension - 2);
  if (instruction == ns_instructions.D and can_move_right == 1) {
        let (ships_new) = update_ships_moved(ship, ships_dict, 1, 0);
        return iterate_ships(
            board_dimension,
            ships_new,
            board_dict,
            i + 1,
            instructions_len,
            instructions
        );
    }
  let can_move_left = is_le(1, ship.index.x);
    if (instruction == ns_instructions.A and can_move_left == 1) {
        let (ships_new) = update_ships_moved(ship, ships_dict, -1, 0);
        return iterate_ships(
            board_dimension,
            ships_new,
            board_dict,
            i + 1,
            instructions_len,
            instructions
        );
    }
    let can_move_down = is_le(ship.index.y, board_dimension - 2);
    if (instruction == ns_instructions.S and can_move_down == 1) {
        let (ships_new) = update_ships_moved(ship, ships_dict, 0, 1);
        return iterate_ships(
            board_dimension,
            ships_new,
            board_dict,
            i + 1,
            instructions_len,
            instructions
        );
    }
    let can_move_up = is_le(1, ship.index.y);
    if (instruction == ns_instructions.W and can_move_up == 1) {
        let (ships_new) = update_ships_moved(ship, ships_dict, 0, -1);
        let (ships_updated, board_updated, res) = check_grid(ship, ships_new, board_dict);
        return iterate_ships(
            board_dimension,
            ships_new,
            board_updated,
            i + 1,
            instructions_len,
            instructions
        );
    }
  return iterate_ships(board_dimension, ships_dict, board_dict, i + 1, instructions_len, instructions);
  }

func check_grid{range_check_ptr}(
    ship: ShipState*, 
    ships_dict: DictAccess*, 
    board_dict: DictAccess*) -> (
    ships_new: DictAccess*, board_new: DictAccess*, res: felt){
    alloc_locals;

    //let i = ship.index.x * ns_dict.MULTIPLIER + ship.index.y;
    let (i) = cords_to_index(ship.index.x, ship.index.y); 
    let (ptr) = dict_read{dict_ptr=board_dict}(key=i);
    tempvar grid = cast(ptr, SingleBlock*);  
    
    // if grid is enemy type
    if(grid.type == 1){
        return(ships_new=ships_dict, board_new=board_dict, res=1);
      }
     
     return(ships_new=ships_dict, board_new=board_dict, res=0);
    }

//////////////////////////////////////////////////////////////
//                      UPDATES
//////////////////////////////////////////////////////////////

// low level functions to update ship state
func update_ships_pc{range_check_ptr}(ship: ShipState*, ships_dict: DictAccess*) -> (
    ships_new: DictAccess*
) {
    tempvar ship_new: ShipState* = new ShipState(ship.id, ship.type, ship.status, Grid(ship.index.x, ship.index.y), ship.pc - 1);
    dict_write{dict_ptr=ships_dict}(key=ship.id, new_value=cast(ship_new, felt));
    return (ships_new=ships_dict);
}

func update_ships_moved{range_check_ptr}(
    ship: ShipState*, ships_dict: DictAccess*, x_inc: felt, y_inc: felt
) -> (ships_new: DictAccess*) {
    tempvar ship_new: ShipState* = new ShipState(ship.id, ship.type, ship.status, Grid(ship.index.x + x_inc, ship.index.y + y_inc), ship.pc);
    dict_write{dict_ptr=ships_dict}(key=ship.id, new_value=cast(ship_new, felt));
    return (ships_new=ships_dict);
}

func update_ship_status{range_check_ptr}(
    ship: ShipState*, ships_dict: DictAccess*
) -> (ships_new: DictAccess*) {
    tempvar ship_new: ShipState* = new ShipState(ship.id, ship.type, 0, Grid(ship.index.x, ship.index.y), ship.pc);
    dict_write{dict_ptr=ships_dict}(key=ship.id, new_value=cast(ship_new, felt));
    return (ships_new=ships_dict);
}

func ship_destroyed{range_check_ptr}(
    i: felt, ships_dict: DictAccess*
) -> (ships_new: DictAccess*) {
    let (ptr) = dict_read{dict_ptr=ships_dict}(key=i);
    tempvar ship = cast(ptr, ShipState*);
    tempvar ship_new: ShipState* = new ShipState(ship.id, ship.type, 0, Grid(ship.index.x, ship.index.y), ship.pc);
    dict_write{dict_ptr=ships_dict}(key=ship.id, new_value=cast(ship_new, felt));
    return (ships_new=ships_dict);
}


