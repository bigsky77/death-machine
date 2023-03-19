///////////////////////////////////////////////////////////
//                      DEATH-MACHINE
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.bool import TRUE, FALSE
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin, HashBuiltin
from src.block.block import Block
from starkware.cairo.common.math_cmp import is_le, is_nn
from starkware.starknet.common.syscalls import get_caller_address 

from src.game.simulation import submit_simulation
//////////////////////////////////////////////////////////////
//                   CONSTRUCTOR 
//////////////////////////////////////////////////////////////

@constructor
func constructor{syscall_ptr: felt*, bitwise_ptr: BitwiseBuiltin*, pedersen_ptr: HashBuiltin*, range_check_ptr}(seed: felt) {
    Block.init(seed);
    return();
  }

