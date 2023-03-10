from apibara.starknet import felt

deathmachine_testnet = "0x04f5e10ce7eb633be4e8ec86e54ff45ed3689359e905b0f088e3ee49d43c4dbf"
setBoard_testnet = "0x22b803be989158361f3042f192dd0cab0bb034cce1c5e1757483eacf64020c9"

address = felt.from_hex(deathmachine_testnet)
event_key = felt.from_hex(setBoard_testnet)
