//////////////////////////////////////////////////////////////
//                        BLOCK
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.starknet.common.syscalls import (
    get_block_number,
    get_block_timestamp,
    get_caller_address,
)
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin, HashBuiltin
from starkware.cairo.common.cairo_keccak.keccak import keccak_felts, finalize_keccak
from starkware.cairo.common.default_dict import default_dict_new, default_dict_finalize
from starkware.cairo.common.math_cmp import is_le, is_in_range 
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import TRUE, FALSE
from starkware.cairo.common.uint256 import Uint256, uint256_eq
from starkware.cairo.common.dict import dict_write, dict_read

from src.game.events import boardSummary 
from src.block.gameboard import SingleBlock 
from src.block.gameboard import init_board
from src.utils.xoroshiro128_starstar import next, generate_seed, State
from src.game.constants import (
  BOARD_SIZE, 
  BOARD_DIMENSION,
  BLOCK_TIME
)

struct BlockData {
    block_number: felt,
    block_seed: State, 
    block_status: felt, // 0=complete, 1=active, 2=pending
    block_reward: felt,
    block_difficulty: felt,
    block_timestamp: felt,
    block_prover: felt,
  }

@storage_var
func Block_Storage(block_number: felt) -> (block: BlockData){

  }

@storage_var
func Current_Block() -> (current_block: felt){

  }

namespace Block {
    func init{
      syscall_ptr: felt*, 
      bitwise_ptr: BitwiseBuiltin*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}(block_number: felt) -> (){
        alloc_locals;

        let (block_timestamp) = get_block_timestamp();
        let (block_seed) = generate_seed(block_timestamp);
        let status = 1;
        let block_reward = 65; // percentage of reward squares out of 100
        let block_difficulty = 5; // percentage of enemey squares out of 100

        tempvar new_block: BlockData = BlockData(
          block_number, 
          block_seed,
          status, 
          block_reward, 
          block_difficulty, 
          block_timestamp,
          0);
        
        Block_Storage.write(block_number, new_block);
        Current_Block.write(block_number);
        get_current_board();
    return();
    }
  
    @external
    func update_status{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      bitwise_ptr: BitwiseBuiltin*, 
      range_check_ptr}() -> (){
      alloc_locals;
      let (block_number) = Current_Block.read();
      let (current_block) = Block_Storage.read(block_number);
      
      tempvar new_block: BlockData = BlockData(
          current_block.block_number, 
          current_block.block_seed,
          0, 
          current_block.block_reward, 
          current_block.block_difficulty, 
          current_block.block_timestamp,
          0);
        
      Block_Storage.write(block_number, new_block);
      init(block_number + 1);
    return();
    }
    
    func is_pending{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}() -> (){
  
      let (current_block) = Current_Block.read();
      let (block) = Block_Storage.read(current_block);
      with_attr error_message("Block not Pending") {
        assert block.status = 2;
      }
    return();
    }
    
    func init_current_board{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      bitwise_ptr: BitwiseBuiltin*, 
      range_check_ptr}(block_number: felt) -> (dict_new: DictAccess*){ 
      alloc_locals; 
      
      let (current_block) = Block_Storage.read(block_number);
      let (board_dict: DictAccess*) = default_dict_new(default_value=0);
      let (dict_new) = init_board(BOARD_DIMENSION, BOARD_SIZE, current_block.block_seed, board_dict);       

    return(dict_new=dict_new);
    }
    
    func record_score{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}(score: felt){ 
      alloc_locals; 
      let (current_block) = Current_Block.read();
      let (block) = Block_Storage.read(current_block);
      
      let is_high_score = is_le(block.block_reward, score);
      if(is_high_score == 1){
          let (player_address) = get_caller_address();
          tempvar new_block: BlockData = BlockData(
            block.block_number, 
            block.block_seed,
            block.block_status, 
            score, 
            block.block_difficulty, 
            block.block_timestamp,
            player_address);
        
        Block_Storage.write(block.block_number, new_block);
        return();
        }

      return();
      }
    
  func get_current_board{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      bitwise_ptr: BitwiseBuiltin*, 
      range_check_ptr}(){ 
    alloc_locals;
    let (block_arr: SingleBlock*) = alloc();
    let (seed) = Current_Block.read(); 
    let (board_dict) = Block.init_current_board(seed);
    let (block_len, block_state) = board_summary(225, block_arr, board_dict);

    boardSummary.emit(block_len, block_state);
    return();
    }
 }

func board_summary{syscall_ptr: felt*, range_check_ptr}(board_size: felt, 
      board_arr: SingleBlock*, 
      board_dict: DictAccess*) -> (board_size: felt, board: SingleBlock*){
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
