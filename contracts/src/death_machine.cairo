//////////////////////////////////////////////////////////////
//                      DEATH-MACHINE
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_le, assert_nn_le, unsigned_div_rem
from starkware.cairo.common.math_cmp import is_le, is_nn
from starkware.starknet.common.syscalls import get_block_timestamp, get_contract_address, get_caller_address
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin, HashBuiltin
from starkware.cairo.common.default_dict import default_dict_new, default_dict_finalize
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write, dict_read

from src.utils.xoroshiro import XOROSHIRO_ADDR 

from src.board.gameboard import (
  setBoard, 
  get_board, 
  init_board, 
  iterate_board, 
  update_board_status,
  SingleBlock
)

from src.game.constants import (
  STAR_RANGE, 
  ns_instructions, 
  N_TURNS, 
  PC, 
  BOARD_SIZE 
)

from src.game.events import (
  simulationSubmit, 
  turnComplete, 
  simulationComplete, 
  shipMoved 
)

from src.game.spaceships import ( 
  InputShipState, 
  ShipState, 
  init_ships, 
  iterate_ships, 
  update_ship_status
  )

from src.game.instructions import InstructionSet, get_frame_instruction_set

from src.game.summary import turn_summary

//////////////////////////////////////////////////////////////
//                   CONSTRUCTOR INTERFACE
//////////////////////////////////////////////////////////////

@constructor
func constructor{syscall_ptr: felt*, bitwise_ptr: BitwiseBuiltin*, pedersen_ptr: HashBuiltin*, range_check_ptr}(address: felt) {
  
    XOROSHIRO_ADDR.write(address);
    setBoard();
    return();
  }

//////////////////////////////////////////////////////////////
//                        SIMULATE
//////////////////////////////////////////////////////////////

@external
func simulation{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
  instructions_sets_len: felt,
  instructions_sets: felt*,
  instructions_len: felt, 
  instructions: felt*, 
  ships_len: felt, 
  ships: InputShipState*) {  
  alloc_locals;
  
  let board_dimension = 10;
 
  let is_valid_ship_len = is_le(ships_len, 3);
    with_attr error_message("ship length limited to 3") {
        assert is_valid_ship_len = 1;
    }
  
  // get new game board   
  let (new_board: SingleBlock*) = alloc();
  let (_, gameboard) = get_board(BOARD_SIZE, new_board);

  let (caller) = get_caller_address();
  
  simulationSubmit.emit(instructions_len, instructions, ships_len, ships, caller);
  
  // initialize ships
  let (ship_dict: DictAccess*) = default_dict_new(default_value=0);
  let (ship_dict: DictAccess*) = init_ships(ships_len, ships, ship_dict, board_dimension);
  
  // initialize board
  let (board_dict: DictAccess*) = default_dict_new(default_value=0);
  let (board_dict: DictAccess*) = init_board(BOARD_SIZE, gameboard, board_dict, board_dimension);  

  simulation_loop(
    49, 
    0, 
    board_dimension, 
    instructions_sets_len,
    instructions_sets,
    instructions_len, 
    instructions, 
    ships_len, 
    ship_dict,
    BOARD_SIZE,
    board_dict);

  return();
  }

//////////////////////////////////////////////////////////////
//                  SIMULATE LOOP
//////////////////////////////////////////////////////////////

func simulation_loop{syscall_ptr: felt*, range_check_ptr}(
  n_cycles: felt,
  cycle: felt,
  board_dimension: felt,
  instructions_sets_len: felt,
  instructions_sets: felt*,
  instructions_len: felt, 
  instructions: felt*, 
  ships_len: felt, 
  ships_dict: DictAccess*,
  board_size: felt,
  board_dict: DictAccess*
  ) {
    alloc_locals;
    
    if(cycle  == n_cycles){

    return ();
    }

    let (local frame_instructions: felt*) = alloc();
    let (ships) = get_frame_instruction_set(
        cycle,
        0,
        ships_dict,
        instructions_sets_len,
        instructions_sets,
        instructions,
        0,
        frame_instructions,
        0,
    );

    let (ships_new, board_new) = simulate_one_frame(
        board_dimension, 
        cycle, 
        instructions_sets_len, 
        frame_instructions, 
        ships, 
        board_size, 
        board_dict);
    
    simulation_loop(
        n_cycles,
        cycle + 1,
        board_dimension,
        instructions_sets_len,
        instructions_sets,
        instructions_len,
        instructions,
        ships_len,
        ships_new,
        board_size,
        board_dict);
    return();
  }

func simulate_one_frame{syscall_ptr: felt*, range_check_ptr}(
    board_dimension: felt,
    cycle: felt,
    instructions_len: felt,
    instructions: felt*,
    ships_dict: DictAccess*,
    board_size: felt,
    board_dict: DictAccess*
) -> (ship_new: DictAccess*, board_new: DictAccess*){
  alloc_locals;

  let (ship_new) = iterate_ships(board_dimension, ships_dict, 0, instructions_len, instructions);
  let (board_new) = iterate_board(board_dimension, board_size, board_dict);
   
  let (ships_final, board_final) = cross_check_board(board_size, ship_new, board_new);
  //turnComplete.emit(3, ships_final);
  return(ship_new=ships_final, board_new=board_final);
  }

//////////////////////////////////////////////////////////////
//                  BOARD CHECKS
//////////////////////////////////////////////////////////////

func cross_check_board{syscall_ptr: felt*, range_check_ptr}(
    board_size: felt,
    ships_dict: DictAccess*, 
    board_dict: DictAccess*) -> (ships_new: DictAccess*, board_new: DictAccess*){
  
  if(board_size == 0){
      return(ships_dict, board_dict);
    }
  
  let ship_count = 3;  //todo: update to variable
  let (ptr) = dict_read{dict_ptr=board_dict}(key=board_size);
  tempvar board = cast(ptr, SingleBlock*);
  
  let (ships_new, board_new) = check_ship(ship_count, ships_dict, board, board_dict);
  
  return cross_check_board(board_size - 1, ships_new, board_new);
  }

func check_ship{syscall_ptr: felt*, range_check_ptr}(
    ship_count: felt, 
    ships_dict: DictAccess*, 
    board: SingleBlock*,
    board_dict: DictAccess*) -> (ships_new: DictAccess*, board_new: DictAccess*){
  alloc_locals;

  if(ship_count == 0){
      return(ships_dict, board_dict);
    }
  
  let (ptr) = dict_read{dict_ptr=ships_dict}(key=ship_count - 1);
  tempvar ship = cast(ptr, ShipState*);
  
  if(ship.index.x == board.index.x){
      if(ship.index.y == board.index.y){
        if(board.type == 1){
          // you found a star 
          let (board_updated) = update_board_status(board, board_dict); 
          return check_ship(ship_count -1, ships_dict, board, board_updated);  
          }
          if(board.type == 2){
            // you hit an enemy and are dead
            let (ships_updated) = update_ship_status(ship, ships_dict);
            return check_ship(ship_count -1, ships_updated, board, board_dict);
            }
        }
    }

  return check_ship(ship_count - 1, ships_dict, board, board_dict);
  }




