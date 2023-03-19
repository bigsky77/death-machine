/////////////////////////////////////////////////////////////
//                      COMMIT-REVEAL
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_keccak.keccak import keccak_felts, finalize_keccak
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.uint256 import Uint256, uint256_eq
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.bool import TRUE, FALSE

from src.game.ships import InputShipState
from src.block.block import Block

struct ShipHash {
    ship_a: Uint256,
    ship_b: Uint256,
    ship_c: Uint256,
  }

@storage_var
func caller_address_hash_storage(player_address: felt) -> (hashed_response: ShipHash) {
}

@view
func view_get_keccak_hash{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(salt: felt, ship_x: felt, ship_y: felt) -> (hashed_value: Uint256) {
    alloc_locals;
    let (local keccak_ptr_start) = alloc();
    let keccak_ptr = keccak_ptr_start;
    let (local arr: felt*) = alloc();
    assert arr[0] = salt;
    assert arr[1] = ship_x;
    assert arr[2] = ship_y;
    let (hashed_value) = keccak_felts{keccak_ptr=keccak_ptr}(3, arr);
    finalize_keccak(keccak_ptr_start=keccak_ptr_start, keccak_ptr_end=keccak_ptr);
    return (hashed_value,);
}

@view
func view_get_hash_for{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    address: felt
) -> (hashed_response: Uint256) {
    let (hashed_response) = caller_address_hash_storage.read(address);
    return (hashed_response,);
}

@external
func commit_hash{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(caller_address: felt, hash_response: ShipHash) {
    Block.update_status();
    caller_address_hash_storage.write(caller_address, hash_response);
    return ();
}

@external
func reveal_ships{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(number: felt, ships_len: felt, ships: InputShipState*) -> (res: felt) {
    alloc_locals;

    if(ships_len == 0){
        let (caller_address) = get_caller_address();
        caller_address_hash_storage.write(caller_address, ShipHash(Uint256(0, 0), Uint256(0, 0), Uint256(0, 0)));
        return(res=0);
      }  
    tempvar loc_x = ships[ships_len].index.x;
    tempvar loc_y = ships[ships_len].index.y;
    reveal(number, loc_x, loc_y);
  
    return reveal_ships(number, ships_len - 1, ships);
} 

func reveal{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(number: felt, response_x: felt, response_y: felt) {
    alloc_locals;
    let (caller_address) = get_caller_address();
    let (committed_hash) = caller_address_hash_storage.read(caller_address);
    let (is_eq_to_zero) = uint256_eq(committed_hash.ship_a, Uint256(0, 0));
    with_attr error_message("You should first commit something") {
        assert is_eq_to_zero = FALSE;
    }
    let (current_hash) = view_get_keccak_hash(number, response_x, response_y);
    let (is_eq) = uint256_eq(current_hash, committed_hash.ship_a);
    with_attr error_message("You are trying to cheat") {
        assert is_eq = TRUE;
    }
    return ();
}
