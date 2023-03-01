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
from src.board.gameboard import setBoard, get_board, init_board
from src.game.types import GameBoard 
from src.game.constants import STAR_RANGE, ns_instructions, N_TURNS, PC, BOARD_SIZE 
from src.game.events import simulationSubmit, turnComplete, simulationComplete, shipMoved
from src.game.spaceships import InputShipState, ShipState, init_ships, iterate_ships
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
  let (new_board: GameBoard*) = alloc();
  let (_, gameboard) = get_board(BOARD_SIZE, new_board);

  let (caller) = get_caller_address();
  
  simulationSubmit.emit(instructions_len, instructions, ships_len, ships, caller);
  
  // initialize ships
  let (ship_dict: DictAccess*) = default_dict_new(default_value=0);
  let (ship_dict: DictAccess*) = init_ships(ships_len, ships, ship_dict, board_dimension);
  
  // initialize board
  let (board_dict: DictAccess*) = default_dict_new(default_value=0);
  let (board_dict: DictAccess*) = init_board(BOARD_SIZE, gameboard, ship_dict);  

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
  ships: DictAccess*,
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
        ships,
        instructions_sets_len,
        instructions_sets,
        instructions,
        0,
        frame_instructions,
        0,
    );

    let (ships_new) = simulate_one_frame(
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
    ships: DictAccess*,
    board_size: felt,
    board_dict: DictAccess*
) -> (ship_new: DictAccess*){
  alloc_locals;

  let (ship_new) = iterate_ships(board_dimension, ships, 0, instructions_len, instructions);

  return(ship_new=ship_new);
  }
