//////////////////////////////////////////////////////////////
//                      GAME BOARD
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.syscalls import get_block_timestamp, get_contract_address, get_caller_address
from starkware.cairo.common.math import assert_le, assert_nn_le, unsigned_div_rem
from starkware.cairo.common.math_cmp import is_le, is_in_range 
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write, dict_read

from src.utils.xoroshiro import get_next_rnd 
from src.block.grid import Grid 
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
    raw_index: Grid,
}

func init_board{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    dimension: felt,
    board_size: felt, 
    dict: DictAccess*, 
) -> (dict_new: DictAccess*) {
     
    if (board_size == 0) {
        return (dict_new=dict);
    }
    
    let (block_type) = generate_type();
    let (x, y) = index_to_cords(board_size);
   
    tempvar new_block: SingleBlock* = new SingleBlock(board_size, block_type, 1, Grid(x=x,y=y), Grid(x=x,y=y));
    dict_write{dict_ptr=dict}(key=new_block.id, new_value=cast(new_block, felt));

    return init_board(dimension, board_size - 1, dict);
}

func iterate_board{syscall_ptr: felt*, range_check_ptr}(
    dimension: felt,
    board_size: felt, 
    board_dict: DictAccess*, 
) -> (dict_new: DictAccess*) {
    
    if(board_size == 0){
        return(dict_new=board_dict);
      }

    let (ptr) = dict_read{dict_ptr=board_dict}(key=board_size);
    tempvar grid = cast(ptr, SingleBlock*);
    
    if (grid.type != 2){
      return iterate_board(dimension, board_size - 1, board_dict);
      }
    
    //let(board_updated) = generate_move(board_dict, grid);
    return iterate_board(dimension, board_size - 1, board_dict);
}

//////////////////////////////////////////////////////////////
//                    TYPE AND MOVE GENERATOR 
//////////////////////////////////////////////////////////////

func generate_type{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (block_type: felt){
    let (r) = get_next_rnd();
    let (_, res) = unsigned_div_rem(r, 100); 
    
    // randomly assing grid type in range
    let x = is_le(res, 30);
    if(x == 1){
      return(block_type=0);
      }

    let y = is_le(res, 70);
    if(y == 1){  
      return(block_type=2);
      }
    
    let z = is_le(res, 95);
    if(z == 1){  
      return(block_type=3);
      }
    
    let b = is_le(res, 100);
    if(b == 1){  
      return(block_type=1);
      }

    return(block_type=0);
  }


