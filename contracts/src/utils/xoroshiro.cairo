//////////////////////////////////////////////////////////////
//                      PRNG INTERFACE
//////////////////////////////////////////////////////////////

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

@storage_var
func XOROSHIRO_ADDR() -> (address: felt){

  }

@contract_interface
namespace IXoroshiro{
    func next() -> (rnd : felt){
      }
}

@external
func get_next_rnd{syscall_ptr : felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (rnd : felt){
    let (contract_address) = XOROSHIRO_ADDR.read();
    let rnd = IXoroshiro.next(contract_address=contract_address);
    return (rnd);
}


