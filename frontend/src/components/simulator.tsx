import ShipState, {ShipStatus, ShipType} from '../types/ShipState';
import AtomState, {AtomStatus, AtomType} from '../types/AtomState';
import Grid from '../types/Grid'
import BoardConfig from '../types/BoardConfig';
import Frame from '../types/Frame';

export function isIdenticalGrid (
    grid1 : Grid,
    grid2 : Grid
): boolean {
    return JSON.stringify(grid1) == JSON.stringify(grid2)
}

//
// a pure function that runs simulation for fixed cycles
//
export default function simulator(
    n_cycles : number,
    ships : ShipState[],
    atoms : AtomState[],
    instructionSets : string[][],
    boardConfig: BoardConfig, // including atom faucet, operator, atom sink - these don't change in frames
): Frame[] {

    // logging
    console.log("> simulator receives ships:", ships)
    console.log("> simulator receives atoms:", atoms)
    console.log("> simulator receives instructionSets:", instructionSets)
    console.log("> simulator receives boardConfig:", boardConfig)

    // guardrail
    if (!boardConfig) {return []}
   //
    // Prepare the first frame
    //
    var grid_populated_bools : { [key: string] : boolean } = {}
    for (var i=0; i<boardConfig.dimension; i++){
        for (var j=0; j<boardConfig.dimension; j++){
            grid_populated_bools[JSON.stringify({x:i,y:j})] = false
        }
    }
    for (const atom of atoms) {
        grid_populated_bools[JSON.stringify(atom.index)] = true
    }
    const frame_init : Frame= {
        ships: ships,
        atoms: atoms,
        grid_populated_bools: grid_populated_bools,
        notes: '',
    }

    //
    // Forward system by n_cycles;
    // Record frames emitted;
    // each frame carries all objects with their states i.e. frame == state screenshot
    //
    var frame_s: Frame[] = [frame_init]
    for (var cycle_i=0; cycle_i<n_cycles; cycle_i++) {
        //
        // Prepare instruction for each ship;
        // if ship is blocked, it stays at its current instruction, otherwise advances to next instruction
        //
        var instruction_per_ship = []
        frame_s[frame_s.length-1].ships.forEach((ship:Shipstate, ship_i:number) => {
            // get ship's sequence of instructions
            const instructionSet = instructionSets[ship_i]

            // pick instruction at pc_next
            const instruction = instructionSet [ship.pc_next % instructionSet.length]

            // record instruction to be executed for this ship in this frame
            instruction_per_ship.push (instruction)
        })
        // console.log(`cycle ${i}, instruction_per_ship ${JSON.stringify(instruction_per_ship.}`)

        // Run simulate_one_cycle()
        const last_frame = frame_s[frame_s.length-1]
        const new_frame: Frame = _simulate_one_cycle (
            instruction_per_ship,
            last_frame,
            boardConfig
        )
        // console.log('frame.atoms', i, ":", JSON.stringify(frame.atoms))

        // Record frame emitted
        frame_s.push(new_frame)
    }

    return frame_s
}

//
// a pure function that runs simulation for one cycle, according to instruction input
//
function _simulate_one_cycle (
    instruction_per_ship: string[],
    frame_curr: Frame, // {ships, atoms, grid_populated_bools}
    boardConfig: BoardConfig
): Frame {
    //
    // Unpack frame
    //
    const ships_curr = frame_curr.ships // array of {'id':'ship..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const atoms_curr = frame_curr.atoms // array of {'id':'atom..', 'index':{x:..,y:..}, 'status':'..', 'typ':'..'}
    const operator_states_curr = frame_curr.operatorStates
    const grid_populated_bools = frame_curr.grid_populated_bools // mapping 'x..y..' => true/false

    //
    // Prepare mutable variable for this cycle pass
    //
    var ships_new: Shipstate[] = []
    var atoms_new: AtomState[] = JSON.parse(JSON.stringify(atoms_curr)) // object cloning
    var grid_populated_bools_new: { [key: string] : boolean } = JSON.parse(JSON.stringify(grid_populated_bools)) // object cloning
    var cost_accumulated_new = frame_curr.cost_accumulated // a primitive type variable (number) can be cloned by '='
    var notes = ''

    // Iterate through ships
    //
    // for (const ship of ships_curr) {
    ships_curr.map((ship: Shipstate, ship_i: number) => {

        // backward compatibility: convert instruction to lowercase letter; convert '_' to '.'
        let instruction: string = instruction_per_ship[ship_i].toLowerCase()
        if (instruction == '_') instruction = '.'

        var ship_new = {id:ship.id, typ:ship.typ, index:ship.index, status:ship.status, description:ship.description, pc_next:ship.pc_next}

        // console.log (`ship${ship.i} running ${instruction}`)

        // add note
        notes += `intended ${instruction}/`

        if (instruction == 'd'){ // x-positive

            // non-blocking
            ship_new.pc_next += 1

            if (ship.index.x < boardConfig.dimension-1) {
                // move ship
                ship_new.index = {x:ship.index.x+1, y:ship.index.y}

                // move atom if possessed by this ship
                let has_moved_atom = false
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.index.x += 1
                        theArray[i] = atom_new
                        has_moved_atom = true
                    }
                });

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 'a'){ // x-negative

            // non-blocking
            ship_new.pc_next += 1

            if (ship.index.x > 0) {
                // move ship
                ship_new.index = {x:ship.index.x-1, y:ship.index.y}

                // move atom if possessed by this ship
                let has_moved_atom = false
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.index.x -= 1
                        theArray[i] = atom_new
                        has_moved_atom = true
                    }
                });

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 's'){ // y-positive

            // non-blocking
            ship_new.pc_next += 1

            if (ship.index.y < boardConfig.dimension-1) {
                ship_new.index = {x:ship.index.x, y:ship.index.y+1}

                // move atom if possessed by this ship
                let has_moved_atom = false
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.index.y += 1
                        theArray[i] = atom_new
                        has_moved_atom = true
                    }
                });

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 'w'){ // y-negative

            // non-blocking
            ship_new.pc_next += 1

            if (ship.index.y > 0) {
                ship_new.index = {x:ship.index.x, y:ship.index.y-1}

                // move atom if possessed by this ship
                let has_moved_atom = false
                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.status == AtomStatus.POSSESSED && atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.index.y -= 1
                        theArray[i] = atom_new
                        has_moved_atom = true
                    }
                });

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 'z'){ // GET

            // non-blocking
            ship_new.pc_next += 1

            if (
                    (ship.status == Shipstatus.OPEN) &&
                    (grid_populated_bools_new[JSON.stringify(ship.index)] == true) // atom available for grab here
            ) {
                ship_new.status = Shipstatus.CLOSE
                grid_populated_bools_new[JSON.stringify(ship.index)] = false

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if ( isIdenticalGrid(atom.index, ship.index) && atom.status==AtomStatus.FREE ){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.POSSESSED
                        atom_new.possessed_by = ship.id
                        theArray[i] = atom_new
                    }
                });

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_GET

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 'x'){ // PUT

            // non-blocking
            ship_new.pc_next += 1

            if (
                    (ship.status == ShipStatus.CLOSE) &&
                    (grid_populated_bools_new[JSON.stringify(ship.index)] == false) // can drop atom here
            ) {
                ship_new.status = Shipstatus.OPEN
                grid_populated_bools_new[JSON.stringify(ship.index)] = true

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.FREE
                        atom_new.possessed_by = null
                        theArray[i] = atom_new
                    }
                });

                // add note
                notes += 'success/'
            }
            else {
                // add note
                notes += 'fail/'
            }
        }
        else if (instruction == 'g'){ // block-until-pickup
            // Note: the ship will wait at this instruction until its location has a free atom to be picked up;
            // it then picks up the free atom in the same frame, and proceed to its next instruction in the next frame;
            // if the ship is closed when encountering this instruction (i.e. not able to pick up), this instruction is treated as no-op.

            if (ship.status == Shipstatus.CLOSE) { // treated as no-op; does not incur cost
                ship_new.pc_next += 1

                // add note
                notes += 'no-op/'
            }
            else if (grid_populated_bools_new[JSON.stringify(ship.index)] == false) { // no atom for pick-up
                ship_new.pc_next = ship.new.pc_next // blocked

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_BLOCKED

                // add note
                notes += 'blocked/'
            }
            else {
                ship_new.pc_next += 1

                // pick up the atom
                // TODO: refactor the following code which is copied from the if statement for GET
                ship_new.status = Shipstatus.CLOSE
                grid_populated_bools_new[JSON.stringify(ship.index)] = false

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if ( isIdenticalGrid(atom.index, ship.index) && atom.status==AtomStatus.FREE ){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.POSSESSED
                        atom_new.possessed_by = ship.id
                        theArray[i] = atom_new
                    }
                });

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_GET

                // add note
                notes += 'success/'
            }

        }
        else if (instruction == 'h'){ // block-until-drop
            // the ship will wait at this instruction until its location is empty for drop-off;
            // it then drops off the atom in possession in the same frame, and proceed to its next instruction in the next frame;
            // if the ship is open when encountering this instruction
            // (i.e. not possessing an atom for drop-off), this instruction is treated as no-op.


            if (ship.status == Shipstatus.OPEN) { // treated as no-op; does not incur cost
                ship_new.pc_next += 1

                // add note
                notes += 'no-op/'
            }
            else if (grid_populated_bools_new[JSON.stringify(ship.index)] == true) { // can't drop because grid populated
                ship_new.pc_next = ship.new.pc_next // blocked

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_BLOCKED

                // add note
                notes += 'blocked/'
            }
            else {
                ship_new.pc_next += 1

                // drop the atom
                // TODO: refactor the following code which is copied from the if statement for PUT

                ship_new.status = Shipstatus.OPEN
                grid_populated_bools_new[JSON.stringify(ship.index)] = true

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.possessed_by == ship.id){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.FREE
                        atom_new.possessed_by = null
                        theArray[i] = atom_new
                    }
                });

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_PUT

                // add note
                notes += 'success/'
            }
        }
        else if (instruction == 'c'){ // CARELESS PUT

            // non-blocking
            ship_new.pc_next += 1

            if (ship.status == Shipstatus.CLOSE) {
                ship_new.status = Shipstatus.OPEN
                let index = 0
                let populated = grid_populated_bools_new[JSON.stringify(ship.index)]

                atoms_new.forEach(function (atom: AtomState, i: number, theArray: AtomState[]) {
                    if (atom.possessed_by == ship.id && !populated){
                        var atom_new = theArray[i]
                        atom_new.status = AtomStatus.FREE
                        atom_new.possessed_by = null
                        theArray[i] = atom_new
                        grid_populated_bools_new[JSON.stringify(ship.index)] = true
                    } else if (atom.possessed_by == ship.id){
                        index = i
                    }
                });

                if (index != 0){
                    atoms_new.splice(index, 1)
                }

                // update cost
                cost_accumulated_new += DYNAMIC_COSTS.SINGLETON_CARELESS_PUT

                // add note
                notes += 'success/'
            }
        }
        else if (instruction == '.'){
            // non-blocking
            ship_new.pc_next += 1
        }

        // record the new ship
        ships_new.push (ship_new)

        // add note
        notes += JSON.stringify(ship) + ' => ' + JSON.stringify(ship_new) + ';'
    })
   const frame_new: Frame = {
        ships: ships_new,
        atoms: atoms_new,
        //operatorStates: operator_states_new,
        grid_populated_bools: grid_populated_bools_new,
        //delivered_accumulated: delivered_accumulated_new,
        //cost_accumulated: cost_accumulated_new,
        notes: notes,
    }
    return frame_new
}
