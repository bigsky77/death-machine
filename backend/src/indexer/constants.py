from apibara.starknet import felt

deathmachine_testnet = "0x0265f777fd1907febb2024cbab64f598e58dbecb0c94f4a13ca672bd209dcf3e"
setBoard_testnet = "0x33d11f93ab7d21818c9bffdf8a776c72fdf926b0a7d3ec919c75c8b0bc99c62"

address = felt.from_hex(deathmachine_testnet)
event_key = felt.from_hex(setBoard_testnet)
