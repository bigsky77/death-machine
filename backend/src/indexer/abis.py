uint256_abi = {
    "name": "Uint256",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "low", "offset": 0, "type": "felt"},
        {"name": "high", "offset": 1, "type": "felt"},
    ],
}

boardSet_abi = {
    "name": "boardSet",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "star_array_len", "type": "felt"},
        {"name": "star_array", "type": "Star*"},
        {"name": "enemy_array_len", "type": "felt"},
        {"name": "enemy_array", "type": "Enemy*"},
        {"name": "player_address", "type": "felt"},
    ],
}

star_abi = {
    "name": "Star",
    "type": "struct",
    "size": 3,
    "members": [
        {"name": "x", "offset": 0, "type": "felt"},
        {"name": "y", "offset": 1, "type": "felt"},
        {"name": "isActive", "offset": 2, "type": "felt"},
    ],
}

enemy_abi = {
    "name": "Enemy",
    "type": "struct",
    "size": 3,
    "members": [
        {"name": "x", "offset": 0, "type": "felt"},
        {"name": "y", "offset": 1, "type": "felt"},
        {"name": "isActive", "offset": 2, "type": "felt"},
    ],
}
