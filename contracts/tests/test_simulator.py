from re import M
import pytest
from starkware.starknet.testing.starknet import Starknet
import asyncio
import logging
from utils import import_json

LOGGER = logging.getLogger(__name__)


@pytest.fixture(scope="module")
def event_loop():
    return asyncio.new_event_loop()


@pytest.fixture(scope="module")
async def starknet():
    starknet = await Starknet.empty()
    return starknet


@pytest.mark.asyncio
async def test(starknet):

    # Deploy contract
    xoroshiro = await starknet.deploy("./src/utils/xoroshiro128_starstar.cairo", constructor_calldata=[1]);
    contract = await starknet.deploy(source="./src/death_machine.cairo", constructor_calldata=[xoroshiro.contract_address])
    LOGGER.info(f"> Deployed death_machine.cairo.")
    print(f"> Deployed death_machine.cairo.")
    await contract.simulation(
        [7, 7, 7],
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
        [(0, 0, 1, (3, 3), 0), (1, 0, 1, (3, 4), 0), (2, 0, 1, (5, 5), 0)],
    ).call()

