//////////////////////////////////////////////////////////////
//                  DEATH-MACHINE TYPES
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_le, assert_nn_le, unsigned_div_rem
from starkware.starknet.common.syscalls import get_block_timestamp, get_contract_address, get_caller_address
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin, HashBuiltin

struct Grid {
    x: felt,
    y: felt,
  }

struct Instructions {
    instructionSet_lens: felt,
    instructionSet: felt*,
  }


