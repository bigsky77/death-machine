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

from indexer.constants import address, event_key
from indexer.abis import boardSet_abi, singleBlock_abi, grid_abi

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

def decode_boardSet_event(data):
    return boardSet_decoder.to_python([felt.to_int(d) for d in data])

def encode_int_as_bytes(n):
    return n.to_bytes(32, "big")

class DeathMachineIndexer(StarkNetIndexer):
    def indexer_id(self) -> str:
        return indexer_id

    print("Starting DeathMachine Indexer")

    def initial_configuration(self) -> Filter:
        filter = Filter().with_header(weak=True).add_event(
            EventFilter().with_from_address(address).with_keys([event_key])
        )
        return IndexerConfiguration(
            filter=filter,
            starting_cursor=starknet_cursor(782_000),
            finality=DataFinality.DATA_STATUS_PENDING,
        )

    async def handle_data(self, info: Info, data: Block):
        block_time = data.header.timestamp.ToDatetime()

        print(f"Processing block {data.header.block_number} at {block_time}")

        boardSets = [
            decode_boardSet_event(event.event.data)
            for event in data.events
        ]
        print(f"Board", boardSets[0].board[0])

        boardSet_docs = [
                {
                #"star_array_len": encode_int_as_bytes(bo.star_array_len),
                "board_array": boardSets[0].board,
                #"enemy_array_len": encode_int_as_bytes(bo.enemy_array_len),
                }
            for bo in boardSets
        ]

        await info.storage.insert_many("boardSet_docs", boardSet_docs)

        for event_with_tx in data.events:
            tx_hash = felt.to_hex(event_with_tx.transaction.meta.hash)
            event = event_with_tx.event

            print(f"   Tx Hash: {tx_hash}")
            print()


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
