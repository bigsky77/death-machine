//////////////////////////////////////////////////////////////
//                      GAME BOARD
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.syscalls import get_block_timestamp, get_contract_address, get_caller_address
from starkware.cairo.common.math import assert_le, assert_nn_le, unsigned_div_rem
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write, dict_read

from src.utils.xoroshiro import XOROSHIRO_ADDR, IXoroshiro, get_next_rnd 
from src.game.types import Grid 
from src.game.constants import RANGE_X, RANGE_Y, STAR_RANGE, ENEMY_RANGE, PLANET_RANGE, ns_board, ns_dict, BOARD_SIZE   
from src.utils.utils import index_to_cords, cords_to_index

//////////////////////////////////////////////////////////////
//                        BOARD
//////////////////////////////////////////////////////////////

struct SingleBlock {
    id: felt,
    type: felt,
    status: felt,
    index: Grid,
    new_index: Grid,
}

@storage_var
func Block_Id() -> (id: felt){

  }

func init_board{range_check_ptr}(
    board_size: felt, 
    dict: DictAccess*, 
) -> (dict_new: DictAccess*) {
    
    if (board_size == 0) {
        return (dict_new=dict);
    }
    
    let (x, y) = index_to_cords(board_size);
    tempvar new_block: SingleBlock* = new SingleBlock(board_size, 1, 1, Grid(x=x,y=y), Grid(x=0,y=0));
    dict_write{dict_ptr=dict}(key=new_block.id, new_value=cast(new_block, felt));

    return init_board(board_size - 1, dict);
}

