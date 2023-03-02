 ##       
 ##       DEATH-MACHINE 💀⚙️

This is the monorepo for DEATH-MACHINE a smart-contract game on Starknet.  

### System Overiew 

#### Contracts

Cairo contracts.  This directory contains the game code written in Cairo, as well as python deployment and testing scripts.  

To set up the python virtual environement in the directory run.

`python3.9 -m venv venv

source venv/bin/activate

pip install poetry`

and then.

`poetry install`

To run unit tests. 

`pytest test/test_simulator --asyncio-mode=auto`

The main folders in the directory are laid out below.  Cairo smart-contracts are in the contracts folder. 

```
  contracts
├──  build
├──  deployer
├──  src
│  ├──  board
│  ├──  death_machine.cairo
│  ├──  game
│  └──  utils
├──  tests
```

#### Backend

Starknet event indexer using Apibara.

#### Frontend

React Frontend
