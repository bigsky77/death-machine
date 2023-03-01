//////////////////////////////////////////////////////////////
//                  DEATH-MACHINE TYPES
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_le, assert_nn_le, unsigned_div_rem
from starkware.starknet.common.syscalls import get_block_timestamp, get_contract_address, get_caller_address
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin, HashBuiltin

struct GameBoard {
    x: felt,
    y: felt,
    gridType: felt,
    active: felt,
  }

struct Grid {
    x: felt,
    y: felt,
  }

struct Star {
    x: felt,
    y: felt,
    isActive: felt,
  }

struct Enemy {
    x: felt,
    y: felt,
    isActive: felt,
  }

struct Planet {
    x: felt,
    y: felt,
    isActive: felt,
  }

struct Escape {
    x: felt,
    y: felt,
  }

struct Instructions {
    instructionSet_lens: felt,
    instructionSet: felt*,
  }

struct Spaceship {
    id: felt,
    x: felt,
    y: felt,
    isActive: felt,
  }

