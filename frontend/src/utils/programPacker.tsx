//import { toBN } from 'starknet/dist/utils/num'

interface Spaceship {
    id: number
    isActive: number
    index: Grid
}

export function programsToInstructionSets (programs) {

    let instructionSets:string[][] = []

    programs.forEach((program: string, mech_i:number) => {
        const instructions = program.split(',') as string[]
        instructionSets.push (instructions)
    })

    return instructionSets
}

export function packProgram(
    instructionSets: string[][],
    shipInitPositions: Grid[],
)  {

    let program_length_array = []
    let program_serialized_array = []
    for (const instructionSet of instructionSets) {
        program_length_array.push (instructionSet.length)

        const encoded_program = encodeInstructionSet (instructionSet)
        program_serialized_array = program_serialized_array.concat (encoded_program)
    }

    let ships_array: Ship[] = []
    shipInitPositions.forEach((grid: Grid, index: number) => {
        ships_array.push({
            id: index,
            type: 0,
            status: 1, // open
            index: grid,
            description: "0",
        })
    });

    let args = [];

    // instructions_sets
    args.push (program_length_array.length)
    args = args.concat(program_length_array)

    // instructions (serialized)
    args.push (program_serialized_array.length)
    args = args.concat(program_serialized_array)


    args.push (ships_array.length)
    for (const ship of ships_array) {
        args = args.concat(serialize_ship(ship))
    }

    return args;
}

function encodeInstructionSet (instructionSet) {

    let encodedInstructionSet = []

    for (const instruction of instructionSet) {
        const instruction_lowercase: string = instruction.toLowerCase()
        if ( !(instruction_lowercase in INSTRUCTION_ENCODE) ){
            encodedInstructionSet.push (pack(50)) // no-op
        }
        else {
            encodedInstructionSet.push (INSTRUCTION_ENCODE[instruction_lowercase])
        }
    }

    return encodedInstructionSet
}

//
// Encoding / structs from Cairo implementation
//
export const INSTRUCTION_ENCODE = {
    w : 0,
    a : 1,
    s : 2,
    d : 3,
    z : 4,
    x : 5,
    g : 6,
    h : 7,
    c: 8,
    // _ : 50 (from contract)
}

export const INSTRUCTION_DECODE = { // note: this should be the reverse mapping of INSTRUCTION_ENCODE
    0: 'w',
    1: 'a',
    2: 's',
    3: 'd',
    4: 'z',
    5: 'x',
    6: 'g',
    7: 'h',
    8: 'c',
    50: '_'
}

function pack (x: number) {
 //   return toBN(x).toString()
}

function indexToCoordinate(index: number): [number, number] {
  const zeroBasedIndex = index - 1;
  const x = (zeroBasedIndex % 15) + 1;
  const y = Math.floor(zeroBasedIndex / 15) + 1;
  return [x, y];
}

export function coordinateToIndex(x: number, y: number): number {
  const zeroBasedX = x - 1;
  const zeroBasedY = y - 1;
  const index = zeroBasedY * 15 + zeroBasedX + 1;
  return index;
}

function serialize_ship (ship: Ship) {
    let arr: any[] = [ship.id, ship.type, ship.status]
    arr = arr.concat(serialize_grid(ship.index)).concat([ship.description])
    return arr
}

function serialize_grid (grid: Grid) {
    return [grid.x, grid.y]
}
