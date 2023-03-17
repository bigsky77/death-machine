////////////////////////////////////////////////////////////
//                      DEATH-MACHINE
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.bool import TRUE, FALSE
from src.block import Block
from src.utils.commit import view_get_hash_for, commit_hash, reveal_moves
from starkware.cairo.common.math_cmp import is_le, is_nn
from starkware.starknet.common.syscalls import get_caller_address 
from starkware.starknet.common.syscalls import (
    get_block_number,
    get_block_timestamp,
    get_caller_address,
)
from src.game.constants import (
  BLOCK_TIME, 
)

@storage_var
func moves_commited() -> (count: felt) {
}

@storage_var
func moves_revealed() -> (count: felt) {
}

//////////////////////////////////////////////////////////////
//                   CONSTRUCTOR 
//////////////////////////////////////////////////////////////

@constructor
func constructor{syscall_ptr: felt*, bitwise_ptr: BitwiseBuiltin*, pedersen_ptr: HashBuiltin*, range_check_ptr}(seed: felt) {
  
    let(new_block) = Block.init(seed);
    BlockInitialized.emit(new_block);  // impliment event
  
    return();
  }

//////////////////////////////////////////////////////////////
//                   COMMIT  
//////////////////////////////////////////////////////////////

@external
func commit{
  syscall_ptr: felt*, 
  bitwise_ptr: BitwiseBuiltin*, 
  pedersen_ptr: HashBuiltin*, 
  range_check_ptr}(move_hash: felt) {

  let (status) = Block.get_current_status();
  with_attr error_message("Block Not Active") {
        assert status = 1;
    }
  let (caller) = get_caller_address();
  let (caller_hash) = view_get_hash_for(caller);
  with_attr error_message("ALREADY SUBMITTED") {
        assert caller_hash = 0;
    }
  commit_hash(caller, move_hash);
  let (n) = moves_commited.read();
  moves_commited.write(n + 1);

  return();
  }

@external
func reveal_moves{
  syscall_ptr: felt*, 
  bitwise_ptr: BitwiseBuiltin*, 
  pedersen_ptr: HashBuiltin*, 
  range_check_ptr}(number: felt, player_moves: felt) {
  
  let (current_block) = Block.get_current_block();
  with_attr error_message("Block Not Pending") {
        assert current_block.status = 2;
    }
  
  // ensure legal moves
  reveal_moves(number, player_moves);

  simulation();

  return();
}



