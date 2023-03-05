import ShipState from "./ShipState";
import AtomState, {AtomType} from "./AtomState";
import { OperatorState } from "./Operator";

export default interface Frame {
    ships: ShipState[]
    atoms: AtomState[]
    //operatorStates: OperatorState[]
    grid_populated_bools: { [key: string] : boolean }
    //delivered_accumulated: AtomType[]
    //cost_accumulated: number
    notes: string
    //consumed_atom_ids: string[]
    //produced_atom_ids: string[]
}
