from apibara.starknet import felt

deathmachine_testnet = "0x00752a9254b3148fb70e1d00917e62e8f24e2c7c2272899103856eb4c9ff945c"
boardSummary_testnet = "0x22b803be989158361f3042f192dd0cab0bb034cce1c5e1757483eacf64020c9"

address = felt.from_hex(deathmachine_testnet)
event_key = felt.from_hex(boardSummary_testnet)
