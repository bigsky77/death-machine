from apibara.starknet import felt

deathmachine_testnet = "0x07c521d2f0e60e792c15d41a874f10b4fdcb871299b8d24c8084ec0d9fa8a491"
boardSummary_testnet = "0x22b803be989158361f3042f192dd0cab0bb034cce1c5e1757483eacf64020c9"

address = felt.from_hex(deathmachine_testnet)
event_key = felt.from_hex(boardSummary_testnet)
