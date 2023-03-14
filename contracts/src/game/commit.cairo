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

@storage_var
func caller_address_hash_storage(player_address: felt) -> (hashed_response: Uint256) {
}

@storage_var
func move_per_response_storage(player_address: felt) -> (player_moves: felt) {
}

@view
func view_get_keccak_hash{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(salt: felt, value_to_hash: felt) -> (hashed_value: Uint256) {
    alloc_locals;
    let (local keccak_ptr_start) = alloc();
    let keccak_ptr = keccak_ptr_start;
    let (local arr: felt*) = alloc();
    assert arr[0] = salt;
    assert arr[1] = value_to_hash;
    let (hashed_value) = keccak_felts{keccak_ptr=keccak_ptr}(2, arr);
    finalize_keccak(keccak_ptr_start=keccak_ptr_start, keccak_ptr_end=keccak_ptr);
    return (hashed_value,);
}

@view
func view_get_move_per_player{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt
) -> (player_moves: felt) {
    let (current_moves) = move_per_response_storage.read(player);
    return (current_moves);
}

@view
func view_get_hash_for{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    address: felt
) -> (hashed_response: Uint256) {
    let (hashed_response) = caller_address_hash_storage.read(address);
    return (hashed_response,);
}

@external
func commit_hash{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(caller_address: felt, hash: Uint256) {
    caller_address_hash_storage.write(caller_address, hash);
    return ();
}

@external
func reveal_moves{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}(number: felt, response: felt) {
    alloc_locals;
    let (caller_address) = get_caller_address();
    let (committed_hash) = caller_address_hash_storage.read(caller_address);
    let (is_eq_to_zero) = uint256_eq(committed_hash, Uint256(0, 0));
    with_attr error_message("You should first commit something") {
        assert is_eq_to_zero = FALSE;
    }
    let (current_hash) = view_get_keccak_hash(number, response);
    let (is_eq) = uint256_eq(current_hash, committed_hash);
    with_attr error_message("You are trying to cheat") {
        assert is_eq = TRUE;
    }
    caller_address_hash_storage.write(caller_address, Uint256(0, 0));
    //let (current_number_of_vote) = move_per_response_storage.read(response);
    move_per_response_storage.write(caller_address, player_moves);
    return ();
}
