const RANGE_X = 16;
const RANGE_Y = 16;
const STAR_RANGE = 40;
const ENEMY_RANGE= 20;
const PLANET_RANGE= 15;
const N_TURNS = 49;
const PC = 7;
const BOARD_SIZE = 225;

namespace ns_instructions {
    const W = 0;  // up
    const A = 1;  // left
    const S = 2;  // down
    const D = 3;  // right
    const Z = 4;  // get
    const X = 5;  // put
    const G = 6;  // block-get
    const H = 7;  // block-put
    const C = 8;  // careless put
    const SKIP = 50;  // skip
}

namespace ns_ships {
    const INPUT_SHIP_SIZE = 6;
    const SHIP_SIZE = 6;

    const OPEN = 0;
    const CLOSE = 1;

    const SINGLETON = 0;

    const STATIC_COST_SINGLETON = 150;
}

namespace ns_board {
    const GRID_SIZE = 4;
}

