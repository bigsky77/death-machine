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
from src.game.types import Grid, Star, Enemy, Planet, Escape, GameBoard 
from src.game.constants import RANGE_X, RANGE_Y, STAR_RANGE, ENEMY_RANGE, PLANET_RANGE   
from src.game.events import boardSet 
from src.game.spaceships import ShipState 
from src.utils.utils import index_to_cords, cords_to_index

//////////////////////////////////////////////////////////////
//                          STORAGE
//////////////////////////////////////////////////////////////

@storage_var
func Grid_Loc(x: felt, y: felt) -> (class: felt){

  }

//////////////////////////////////////////////////////////////
//                        BOARD
//////////////////////////////////////////////////////////////

func setBoard{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (player_address: felt, filled_star_array_len: felt, filled_star_array: Star*){
    alloc_locals;

    // set stars
    let (star_array: Star*) = alloc();
    let star_array_len = STAR_RANGE; 
    let (filled_star_array) = set_stars_loop(star_array_len, star_array);
    
    // set enemies
    let (enemy_array: Enemy*) = alloc();
    let enemy_array_len = ENEMY_RANGE; 
    let (filled_enemy_array) = set_enemy_loop(enemy_array_len, enemy_array);

    // set planet
    let (planet_array: Planet*) = alloc();
    let planet_array_len = PLANET_RANGE; 
    let (filled_planet_array) = set_planets_loop(planet_array_len, planet_array);
    
    // set escape point
    //set_escape_point();

    let (caller) = get_caller_address();
    
    boardSet.emit(star_array_len, filled_star_array, enemy_array_len, filled_enemy_array, planet_array_len, filled_planet_array, caller);

    return(player_address=caller, filled_star_array_len=star_array_len, filled_star_array=filled_star_array);
  }

//////////////////////////////////////////////////////////////
//                        LOOPS
//////////////////////////////////////////////////////////////

func set_stars_loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(star_array_len: felt, star_array: Star*) -> (star_array: Star*){
    alloc_locals;

    if (star_array_len == 0){
        return (star_array=star_array);
      }
     
     let (position_x) = get_random_x();
     let (position_y) = get_random_y();

     assert star_array[star_array_len - 1] = Star(
         x=position_x, y=position_y, isActive=1);
    
      Grid_Loc.write(position_x, position_y, 1);

     set_stars_loop(star_array_len - 1, star_array);
     return(star_array=star_array); 
  } 

func set_enemy_loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(enemy_array_len: felt, enemy_array: Enemy*) -> (enemy_array: Enemy*){
    alloc_locals;

    if (enemy_array_len == 0){
        return (enemy_array=enemy_array);
      }
     
     let (position_x) = get_random_x();
     let (position_y) = get_random_y();

     assert enemy_array[enemy_array_len - 1] = Enemy(
         x=position_x, y=position_y, isActive=1);

     Grid_Loc.write(position_x, position_y, 3);
     
     set_enemy_loop(enemy_array_len - 1, enemy_array);
     return(enemy_array=enemy_array); 
  } 

func set_planets_loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(planet_array_len: felt, planet_array: Planet*) -> (planet_array: Planet*){
    alloc_locals;

    if (planet_array_len == 0){
        return (planet_array=planet_array);
      }
     
     let (position_x) = get_random_x();
     let (position_y) = get_random_y();

     assert planet_array[planet_array_len - 1] = Planet(
         x=position_x, y=position_y, isActive=1);
    
     Grid_Loc.write(position_x, position_y, 2);
     
     set_planets_loop(planet_array_len - 1, planet_array);
     return(planet_array=planet_array); 
  } 

   
func set_escape_point{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (escape: Escape){
      alloc_locals;

      let escape: Escape = alloc();
      let (position_x) = get_random_x();
      let (position_y) = get_random_y();    
      
      assert escape = Escape(position_x, position_y);
      Grid_Loc.write(position_x, position_y, 3);
      
      return(escape);
    }

//////////////////////////////////////////////////////////////
//                        UTILS
//////////////////////////////////////////////////////////////

func get_random_x{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (randX: felt){
  alloc_locals;

  let (rand) = get_next_rnd();
  let (_, randX) = unsigned_div_rem(rand, RANGE_X);
  
  return(randX=randX);
  }

func get_random_y{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (randY: felt){
  alloc_locals;
  
  let (rand) = get_next_rnd();
  let (_, randY) = unsigned_div_rem(rand, RANGE_Y);

  return(randY=randY);
  }

func get_board{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(gameboard_arr: felt, gameboard: GameBoard*) -> (gameboard_arr: felt, gameboard: GameBoard*){
  alloc_locals;
  
  if(gameboard_arr == 0){
      return(gameboard_arr, gameboard);
    }
  
  let (loc_x, loc_y) = index_to_cords(gameboard_arr);
  let (grid_type) = Grid_Loc.read(loc_x, loc_y);
  
  assert gameboard[gameboard_arr - 1] = GameBoard(loc_x, loc_y, grid_type, 1);
  get_board(gameboard_arr - 1, gameboard);
  return(gameboard_arr, gameboard);
  }

//////////////////////////////////////////////////////////////
//                        INIT BOARD
//////////////////////////////////////////////////////////////

func init_board{range_check_ptr}(
    board_len: felt, board: GameBoard*, dict: DictAccess*) -> (dict_new: DictAccess*) {
    alloc_locals;

    if (board_len == 0) {
        return (dict_new=dict);
    }
    
    tempvar b = [board];  
    tempvar new_board: GameBoard* = new GameBoard(b.x, b.y, b.gridType, b.active);
    dict_write{dict_ptr=dict}(key=board_len, new_value=cast(new_board, felt));
    
    return init_board(board_len - 1, board + 224, dict);
}

func iterate_board{range_check_ptr}(
  i: felt,
  board_dimension: felt, 
  board_size: felt, 
  board: DictAccess*) ->(new_board: DictAccess*){
  alloc_locals;

  if(i == board_size){
    return(new_board=board);
    }
  
  let (new_board: GameBoard*) = alloc();
  
  let (ptr) = dict_read{dict_ptr=board}(key=i);
  tempvar signle_grid = cast(ptr, GameBoard*);
  
  // todo add skull moves

  return(new_board=board);
  }













