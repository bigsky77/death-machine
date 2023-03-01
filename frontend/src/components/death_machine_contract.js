import { useContract } from '@starknet-react/core'
import { number } from 'starknet'
import { contract_address }  from '../../abi/deploy_address'
import DeathMachineAbi from '../../abi/death_machine_abi.json'

export const DEATHMACHINE_ADDR=contract_address;

export function useDeathMachineContract () {
    return useContract ({ abi: DeathMachineAbi, address: DEATHMACHINE_ADDR })
}
