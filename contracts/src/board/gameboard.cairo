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
from src.game.types import Grid, Star, Enemy, Planet, Escape 
from src.game.constants import RANGE_X, RANGE_Y, STAR_RANGE, ENEMY_RANGE, PLANET_RANGE, ns_board, BOARD_SIZE   
from src.game.events import boardSet 
from src.game.spaceships import ShipState 
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
func Block(index: felt) -> (singleBlock: SingleBlock){

  }

func setBoard{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(){
    alloc_locals;

    let (blocks: SingleBlock*) = alloc();
    create_board(BOARD_SIZE, blocks);

    return();
  }

func create_board{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    blocks_len: felt, 
    blocks: SingleBlock*) 
    -> (blocks_len: felt, blocks: SingleBlock*){
    alloc_locals;
    
    if(blocks_len == 0){
      return(blocks_len, blocks);
      }
    
    let(x, y) = index_to_cords(blocks_len);
    tempvar new_block = SingleBlock(blocks_len, 0, 1, Grid(x=x, y=y), Grid(0,0));
    Block.write(blocks_len, new_block); 

    return create_board(blocks_len - 1, blocks);
}

func get_board{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(board_len: felt, board: SingleBlock*) -> (board_len: felt, board: SingleBlock*){
    alloc_locals;

    if(board_len == 0){
        return(board_len, board);
      }
    
    let (block: SingleBlock) = Block.read(board_len);
    assert board[board_len - 1] = SingleBlock(block.id, block.type, block.status, block.index, block.new_index);

    return get_board(board_len - 1, board);
}

//////////////////////////////////////////////////////////////
//                        INIT BOARD
//////////////////////////////////////////////////////////////

func init_board{range_check_ptr}(
    board_len: felt, board: SingleBlock*, dict: DictAccess*, dimension: felt) -> (dict_new: DictAccess*) {
    alloc_locals;

    if (board_len == 0) {
        return (dict_new=dict);
    }
    
    tempvar single_grid: SingleBlock = [board];
    
    let (ptr) = dict_read{dict_ptr=dict}(key=single_grid.id);
    with_attr error_message("ids must be different") {
        assert ptr = 0;
    }

    with_attr error_message("board not within bounds") {
        assert [range_check_ptr] = dimension - single_grid.index.x;
        assert [range_check_ptr + 1] = dimension - single_grid.index.y;
    }
    let range_check_ptr = range_check_ptr + 2;
   
    tempvar new_board: SingleBlock* = new SingleBlock(board_len, 0, 1, single_grid.index, single_grid.new_index);
    dict_write{dict_ptr=dict}(key=single_grid.id, new_value=cast(new_board, felt));
   
    // todo double check correctness of board array
    return init_board(board_len - 1, board + ns_board.GRID_SIZE, dict, dimension);
}

func iterate_board{range_check_ptr}(
  board_dimension: felt, 
  board_len: felt, 
  board_dict: DictAccess*) ->(board_new: DictAccess*){
  alloc_locals;

  if(board_len == 0){
    return(board_new=board_dict);
    }
  
  let (board: SingleBlock*) = alloc();
  
  //let (ptr) = dict_read{dict_ptr=board_dict}(key=board_len);
  //tempvar single_grid = cast(ptr, SingleBlock*);
  
  // todo add skull moves

  return iterate_board(board_dimension, board_len - 1, board_dict);
  }

func update_board_status{range_check_ptr}(board: SingleBlock*, board_dict: DictAccess*) -> (
    board_new: DictAccess*
) {
    alloc_locals;

    //tempvar board_new: SingleBlock* = new SingleBlock(board.x, Grid(), Grid(), 0);
    //dict_write{dict_ptr=board_dict}(key=0, new_value=cast(board_new, felt));
    
    return (board_new=board_dict);
}












