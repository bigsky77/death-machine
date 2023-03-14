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
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.bool import TRUE, FALSE

from src.utils.utils import view_get_keccak_hash
from src.block.gameboard import init_board
from src.utils.xoroshiro128_starstar import next
from src.game.constants import (
  BOARD_SIZE, 
  BOARD_DIMENSION
)

struct BlockData {
    block_number: felt,
    hash: felt, 
    status: felt, // 0=complete, 1=active, 2=pending
    block_reward: felt,
    block_difficulty: felt,
    block_timestamp: felt,
  }

@storage_var
func Block_Storage(block_hash: felt) -> (block: BlockData){

  }

namespace Block{
    func init{
      syscall_ptr: felt*, 
      bitwise_ptr: BitwiseBuiltin*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}(seed: felt) -> (){

        let (block_timestamp) = get_block_timestamp();
        let block_number = seed; 

        let (block_hash) = view_get_keccak_hash(block_timestamp, block_number);

        let status = 1;
        let block_reward = 65; // percentage of reward squares out of 100
        let block_difficulty = 5; // percentage of enemey squares out of 100

        tempvar new_block: BlockData* = new BlockData(
          block_number, 
          status, 
          block_hash,
          block_reward, 
          block_difficulty, 
          block_timestamp);

        return();
      }
  
    func update_status{
        syscall_ptr: felt*, 
        pedersen_ptr: HashBuiltin*, 
        range_check_ptr}() -> (){
      let (block_timestamp) = get_block_timestamp();
      
      return();
      }
    
    func finalize{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}() -> (){
      
      let (block_timestamp) = get_block_timestamp();
      
      return();
      }

    func get_current_status{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}() -> (){
  
    return();
    }
    
    func get_current_board{
      syscall_ptr: felt*, 
      pedersen_ptr: HashBuiltin*, 
      range_check_ptr}(block_timestamp: felt, block_number: felt) -> (dict_new: DictAccess*){ 
      alloc_locals; 
      
      let (block_hash) = view_get_keccak_hash(block_timestamp, block_number);
      let (current_block) = Block_Storage.read(block_hash); 
      with_attr error_message("Block Not Active") {
        assert current_block.status = 1;
      }
      
      let (board_dict: DictAccess*) = default_dict_new(default_value=0);
      let (dict_new) = init_board(BOARD_DIMENSION, current_block.number, BOARD_SIZE, board_dict);       

    return(dict_new);
    }
    

  }



