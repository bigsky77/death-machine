import asyncio
from starknet_py.contract import Contract
from starknet_py.net.gateway_client import GatewayClient
from starknet_py.net.networks import MAINNET, TESTNET
from starknet_py.net import AccountClient, KeyPair
from starknet_py.net.account.account import Account
from starknet_py.net.signer.stark_curve_signer import StarkCurveSigner
from starknet_py.net.gateway_client import GatewayClient
from starknet_py.net.models.chains import StarknetChainId
from starknet_py.net.udc_deployer.deployer import Deployer
import os

# Local network
local_network_client = GatewayClient("http://localhost:5050")
testnet_client = GatewayClient(TESTNET)

async def start():
    from random import randint

    key_pair = KeyPair.from_private_key(key=0x048c56fb3bac9327017f384ba1a658057f2d65ecce806ba33fa5e66352b7b879)
    signer = StarkCurveSigner(0x03784cf0bc8dcc732839ba298f7f7d2bfbc4e245a0a5d2cbc3966d2af9cc7ee4, key_pair, StarknetChainId.TESTNET)
    account = Account(client=testnet_client, address=0x03784cf0bc8dcc732839ba298f7f7d2bfbc4e245a0a5d2cbc3966d2af9cc7ee4, signer=signer)

    # death-machine contract

    with open('./death-machine-contracts/build/death_machine.json') as dm_contract_file:
        dm_compiled_contract = dm_contract_file.read()

    dm_declare_result = await Contract.declare(
        account=account, compiled_contract=dm_compiled_contract, max_fee=int(1e16)
    )
    # Wait for the transaction
    await dm_declare_result.wait_for_acceptance()

    dm_deploy_call = await dm_declare_result.deploy(constructor_args={"address": 0x06c4cab9afab0ce564c45e85fe9a7aa7e655a7e0fd53b7aea732814f3a64fbee}, max_fee=int(1e18));
    dm_contract = dm_deploy_call.deployed_contract
    
    dm_contract_address = str(dm_contract.address)
    
    #write address to file
    file1 = open('./death-machine-frontend/abi/deploy_address.ts', 'w')
    print('export const contract_address=' + '"' + dm_contract_address + '"', file=file1);
    file1.close();

    print("Contract Deployed", dm_contract.address)
    
if __name__ == "__main__":
    asyncio.run(start())


