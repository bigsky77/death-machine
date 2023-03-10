uint256_abi = {
    "name": "Uint256",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "low", "offset": 0, "type": "felt"},
        {"name": "high", "offset": 1, "type": "felt"},
    ],
}

boardSummary_abi = {
    "name": "boardSummary",
    "type": "event",
    "keys": [],
    "outputs": [
        { "name": "board_len", "type": "felt"},
        { "name": "board", "type": "SingleBlock*"},
    ],
}

singleblock_abi = {
    "name": "SingleBlock",
    "type": "struct",
    "size": 7,
    "members": [
            {
                "name": "id",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "type",
                "offset": 1,
                "type": "felt"
            },
            {
                "name": "status",
                "offset": 2,
                "type": "felt"
            },
            {
                "name": "index",
                "offset": 3,
                "type": "Grid"
            },
            {
                "name": "raw_index",
                "offset": 5,
                "type": "Grid"
            }
        ],
}

grid_abi = {
        "members": [
            {
                "name": "x",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "y",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Grid",
        "size": 2,
        "type": "struct"
}
