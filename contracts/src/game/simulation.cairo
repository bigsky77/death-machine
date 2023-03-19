/////////////////////////////////////////////////////////////
//                        RUN-SIMULATION 
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

from src.block.gameboard import init_board, SingleBlock, iterate_board
from src.block.block import Block, Current_Block, Block_Storage, BlockData

from src.game.constants import (
  STAR_RANGE, 
  ns_instructions, 
  ns_dict,
  ns_ships,
  N_TURNS, 
  PC, 
  BOARD_SIZE, 
  BOARD_DIMENSION
)

from src.game.events import (
  simulationSubmit, 
  gameComplete,
  boardComplete,
  boardSummary,
)

from src.game.ships import ( 
  InputShipState, 
  ShipState, 
  init_ships, 
  iterate_ships,
  update_ship_status
  )

from src.game.instructions import InstructionSet, get_frame_instruction_set
from src.game.commit import reveal_ships 
from src.utils.utils import cords_to_index 

//////////////////////////////////////////////////////////////
//                        SIMULATE
//////////////////////////////////////////////////////////////

@external
func submit_simulation{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, bitwise_ptr: BitwiseBuiltin*,range_check_ptr}(
  instructions_sets_len: felt,
  instructions_sets: felt*,
  instructions_len: felt, 
  instructions: felt*, 
  number: felt,
  ships_len: felt, 
  ships: InputShipState*) {  
  alloc_locals;

  let is_valid_ship_len = is_le(ships_len, 3);
  with_attr error_message("ship length limited to 3") {
    assert is_valid_ship_len = 1;
  }
  // check valid ship positions
  let (res) = reveal_ships(number, ships_len, ships);
  with_attr error_message("invalid submission") {
    assert res = 0;
  }

  simulation(instructions_sets_len, instructions_sets, instructions_len, instructions, ships_len, ships); 
  Block.update_status();
  return();
}

func simulation{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, bitwise_ptr: BitwiseBuiltin*, range_check_ptr}(
  instructions_sets_len: felt,
  instructions_sets: felt*,
  instructions_len: felt, 
  instructions: felt*, 
  ships_len: felt, 
  ships: InputShipState*) {  
  alloc_locals;
  
  let (block_number) = Current_Block.read();
  let (current_block) = Block_Storage.read(block_number);
  let (board_dict: DictAccess*) = default_dict_new(default_value=0);
  let (board_dict: DictAccess*) = init_board(BOARD_DIMENSION, BOARD_SIZE, current_block.block_seed, board_dict);

  // initialize ships
  let (ship_dict: DictAccess*) = default_dict_new(default_value=0);
  let (ship_dict: DictAccess*) = init_ships(ships_len, ships, ship_dict, BOARD_DIMENSION);
  
  simulation_loop(
    49, 
    0, 
    BOARD_DIMENSION, 
    instructions_sets_len,
    instructions_sets,
    instructions_len, 
    instructions, 
    ships_len, 
    ship_dict,
    board_dict,
    BOARD_SIZE,
    current_block,
    );

  return();
  }

//////////////////////////////////////////////////////////////
//                  SIMULATE LOOP
//////////////////////////////////////////////////////////////

func simulation_loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, bitwise_ptr: BitwiseBuiltin*, range_check_ptr}(
  n_cycles: felt,
  cycle: felt,
  BOARD_DIMENSION: felt,
  instructions_sets_len: felt,
  instructions_sets: felt*,
  instructions_len: felt, 
  instructions: felt*, 
  ships_len: felt, 
  ships_dict: DictAccess*,
  board_dict: DictAccess*,
  board_size: felt,
  current_block: BlockData,
  ) {
    alloc_locals;
    
    let (ships_arr: ShipState*) = alloc();
    let (block_arr: SingleBlock*) = alloc();

    if(cycle  == n_cycles){
      // emit ship state
      let (lens, state, score) = end_game_summary(ships_len, ships_arr, ships_dict, 0);
      Block.record_score(score);
      gameComplete.emit(lens, state);
      
      let (block_len, block_state) = board_summary(225, block_arr, board_dict);
      boardComplete.emit(block_len, block_state);

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
        BOARD_DIMENSION, 
        cycle, 
        instructions_sets_len, 
        frame_instructions,
        ships_len,
        ships, 
        board_dict,
        board_size,
        current_block
        );
    
     simulation_loop(
        n_cycles,
        cycle + 1,
        BOARD_DIMENSION,
        instructions_sets_len,
        instructions_sets,
        instructions_len,
        instructions,
        ships_len,
        ships_new,
        board_new,
        board_size,
        current_block
        );
    return();
  }

func simulate_one_frame{syscall_ptr: felt*, bitwise_ptr: BitwiseBuiltin*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    BOARD_DIMENSION: felt,
    cycle: felt,
    instructions_len: felt,
    instructions: felt*,
    ships_len: felt,
    ships_dict: DictAccess*,
    board_dict: DictAccess*,
    board_size: felt,
    current_block: BlockData,
) -> (ship_new: DictAccess*, board_new: DictAccess*){
  alloc_locals;
  
  let (board_new) = iterate_board(BOARD_DIMENSION, board_size, board_dict, current_block.block_seed);
  let (ship_new, board_new) = iterate_ships(BOARD_DIMENSION, cycle, ships_dict, board_new, 0, instructions_len, instructions);

  return(ship_new=ship_new, board_new=board_new);
  }

//////////////////////////////////////////////////////////////
//                   END GAME SUMMARY 
//////////////////////////////////////////////////////////////

// get a summary of the game
func end_game_summary{syscall_ptr: felt*, range_check_ptr}(ships_len: felt, ships: ShipState*, ships_dict: DictAccess*, score: felt) -> (ships_len: felt, ships: ShipState*, score: felt){
  alloc_locals;
  
  if(ships_len == 0){
      return(ships_len, ships, score);
    }

  let (ptr) = dict_read{dict_ptr=ships_dict}(key=ships_len - 1);
  tempvar ship = cast(ptr, ShipState*);
  assert ships[ships_len - 1] = ShipState(ship.id, ship.type, ship.status, ship.index, ship.pc, ship.score);
  
  let score = ships[ships_len - 1].score;

  end_game_summary(ships_len - 1, ships, ships_dict, score);
  return(ships_len, ships, score);
  }

// get a summary of the game
func board_summary{syscall_ptr: felt*, range_check_ptr}(board_size: felt, board_arr: SingleBlock*, board_dict: DictAccess*) -> (board_size: felt, board: SingleBlock*){
  alloc_locals;
  
  if(board_size == 0){
      return(board_size, board_arr);
    }
  
  let (ptr) = dict_read{dict_ptr=board_dict}(key=board_size);
  tempvar board = cast(ptr, SingleBlock*);
  assert board_arr[board_size - 1] = SingleBlock(board.id, board.type, board.status, board.index, board.raw_index);

  board_summary(board_size - 1, board_arr, board_dict);
  return(board_size, board_arr);
  }


