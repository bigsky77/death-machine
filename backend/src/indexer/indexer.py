import asyncio
import logging
import sys

# Apibara imports used in this tutorial
from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block

# StarkNet.py imports
from starknet_py.contract import ContractFunction
from starknet_py.contract import identifier_manager_from_abi
from starknet_py.utils.data_transformer import FunctionCallSerializer

from indexer.constants import address, boardSet_key, gameComplete_key, blockInitialized_key, blockComplete_key 
from indexer.abis import boardSet_abi, grid_abi, singleBlock_abi, gameComplete_abi, blockData_abi, shipState_abi, blockComplete_abi, seed_abi, blockInitialized_abi

# Print apibara logs
root_logger = logging.getLogger("apibara")
root_logger.setLevel(logging.DEBUG)
root_logger.addHandler(logging.StreamHandler())

indexer_id = "DeathMachine"

boardSet_decoder = FunctionCallSerializer(
    abi=boardSet_abi,
    identifier_manager=identifier_manager_from_abi([
        boardSet_abi, singleBlock_abi, grid_abi
    ]),
)

blockComplete_decoder = FunctionCallSerializer(
    abi=blockComplete_abi,
    identifier_manager=identifier_manager_from_abi([
        blockComplete_abi, blockData_abi, seed_abi
    ]),
)

blockInitialized_decoder = FunctionCallSerializer(
    abi=blockInitialized_abi,
    identifier_manager=identifier_manager_from_abi([
        blockInitialized_abi, blockData_abi, seed_abi
    ]),
)

gameComplete_decoder = FunctionCallSerializer(
    abi=gameComplete_abi,
    identifier_manager=identifier_manager_from_abi([
        gameComplete_abi, shipState_abi, grid_abi
    ]),
)

def decode_boardSet_event(data):
    return boardSet_decoder.to_python([felt.to_int(d) for d in data])

def decode_blockComplete_event(data):
    return blockComplete_decoder.to_python([felt.to_int(d) for d in data])

def decode_blockInitialized_event(data):
    return blockInitialized_decoder.to_python([felt.to_int(d) for d in data])

def decode_gameComplete_event(data):
    return gameComplete_decoder.to_python([felt.to_int(d) for d in data])

def encode_int_as_bytes(n):
    return n.to_bytes(32, "big")

class DeathMachineIndexer(StarkNetIndexer):
    def indexer_id(self) -> str:
        return indexer_id

    print("Starting DeathMachine Indexer")

    def initial_configuration(self) -> Filter:
        filter = Filter().with_header(weak=True)
        filter.add_event(
            EventFilter().with_from_address(address)
                .with_keys([blockInitialized_key])
        )
        filter.add_event(
            EventFilter().with_from_address(address)
                .with_keys([blockComplete_key])
        )
        filter.add_event(
            EventFilter().with_from_address(address)
                .with_keys([boardSet_key])
        )
        filter.add_event(
            EventFilter().with_from_address(address)
                .with_keys([gameComplete_key])
        )
        return IndexerConfiguration(
            filter=filter,
            starting_cursor=starknet_cursor(786_000),
            finality=DataFinality.DATA_STATUS_PENDING,
        )

    async def handle_data(self, info: Info, data: Block):
        block_time = data.header.timestamp.ToDatetime()
        print(f"Processing block {data.header.block_number} at {block_time}")

        blockComplete = [
            decode_blockComplete_event(event.event.data)
            for event in data.events
            if event.event.keys == [blockComplete_key]
        ]
        print(f"Block Complete", blockComplete)

        blockInitialized = [
            decode_blockInitialized_event(event.event.data)
            for event in data.events
            if event.event.keys == [blockInitialized_key]
        ]
        #print(f"Block Init", blockInitialized)
        
        boardSets = [
             decode_boardSet_event(event.event.data)
             for event in data.events
             if event.event.keys == [boardSet_key]
        ]
        #print(f"Board", boardSets)
        
        gameComplete = [
             decode_gameComplete_event(event.event.data)
             for event in data.events
             if event.event.keys == [gameComplete_key]
        ]
        #print(f"Game Complete", gameComplete)

        non_empty_gameComplete = [gameComp for gameComp in gameComplete if gameComp]
        gameComplete_docs = [{"ships": gameComp.ships, "score": gameComp.score, "address": str(gameComp.player_address)} for gameComp in non_empty_gameComplete]
        if gameComplete_docs:
            await info.storage.insert_many("gameComplete_docs", gameComplete_docs)

        non_empty_blockComplete = [blockComp for blockComp in blockComplete if blockComp]
        blockComplete_docs = [
                {"number": blockComp.completed_block['number'],
                 "time": blockComp.completed_block['timestamp'],
                 "prover": str(blockComp.completed_block['prover']),
                 "score": blockComp.completed_block['score']
                 }
            for blockComp in non_empty_blockComplete]

        if blockComplete_docs:
            print(f"Block Complete Docs", blockComplete_docs)
            await info.storage.insert_many("blockComplete_docs", blockComplete_docs)
        
        #non_empty_blockInit = [blockInit for blockInit in blockInitialized if blockInit]
        #blockInitialized_docs = [{"data": blockInitialized[0].new_block} for blockInit in non_empty_blockInit]
        #if blockInitialized_docs:
         #   await info.storage.insert_many("blockInitialized_docs", blockInitialized_docs)

        non_empty_boardSets = [boardSet for boardSet in boardSets if boardSet]
        boardSet_docs = [{"data": boardSets[0].board} for boardSet in non_empty_boardSets]
        if boardSet_docs:
            await info.storage.insert_many("boardSet_docs", boardSet_docs)

        for event_with_tx in data.events:
            tx_hash = felt.to_hex(event_with_tx.transaction.meta.hash)
            event = event_with_tx.event
            print(f"   Tx Hash: {tx_hash}")

async def run_indexer(server_url=None, mongo_url=None, restart=None):
    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            stream_url=server_url,
            storage_url=mongo_url,
        ),
        reset_state=restart,
        client_options=[
            ('grpc.max_receive_message_length', 100 * 1024 * 1024)
        ]
    )

    await runner.run(DeathMachineIndexer())
