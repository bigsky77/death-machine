blockComplete_abi = {
    "name": "blockComplete",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "completed_block", "offset": 0, "type": "BlockData"},
    ],
}

blockInitialized_abi = {
    "name": "blockInitialized",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "new_block", "offset": 0, "type": "BlockData"},
    ],
}

boardSet_abi = {
    "name": "boardSummary",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "board_len", "type": "felt"},
        {"name": "board", "type": "SingleBlock*"},
    ],
}

gameComplete_abi = {
    "name": "gameComplete",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "ships_len", "type": "felt"},
        {"name": "ships", "type": "ShipState*"},
        {"name": "score", "type": "felt"},
        {"name": "player_address", "type": "felt"},
    ],
}

shipState_abi = {
    "name": "ShipState",
    "type": "struct",
    "size": 7,
    "members": [
        {"name": "id", "offset": 0, "type": "felt"},
        {"name": "type", "offset": 1, "type": "felt"},
        {"name": "status", "offset": 2, "type": "felt"},
        {"name": "index", "offset": 3, "type": "Grid"},
        {"name": "pc", "offset": 5, "type": "felt"},
        {"name": "score", "offset": 6, "type": "felt"},
    ],
}

singleBlock_abi = {
    "name": "SingleBlock",
    "type": "struct",
    "size": 7,
    "members": [
        {"name": "id", "offset": 0, "type": "felt"},
        {"name": "type", "offset": 1, "type": "felt"},
        {"name": "status", "offset": 2, "type": "felt"},
        {"name": "index", "offset": 3, "type": "Grid"},
        {"name": "raw_index", "offset": 5, "type": "Grid"},
    ],
}

blockData_abi = {
    "name": "BlockData",
    "type": "struct",
    "size": 9,
    "members": [
        {"name": "number", "offset": 0, "type": "felt"},
        {"name": "seed", "offset": 1, "type": "State"},
        {"name": "status", "offset": 3, "type": "felt"},
        {"name": "reward", "offset": 4, "type": "felt"},
        {"name": "difficulty", "offset": 5, "type": "felt"},
        {"name": "timestamp", "offset": 6, "type": "felt"},
        {"name": "prover", "offset": 7, "type": "felt"},
        {"name": "score", "offset": 8, "type": "felt"},
    ],
}

grid_abi = {
    "name": "Grid",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "x", "offset": 0, "type": "felt"},
        {"name": "y", "offset": 1, "type": "felt"},
    ],
}

seed_abi = {
    "name": "State",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "s0", "offset": 0, "type": "felt"},
        {"name": "s1", "offset": 1, "type": "felt"},
    ],
}
