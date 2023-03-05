import Grid from './Grid'

export enum ShipStatus {
    ALIVE = 'alive',
    DEAD = 'dead',
}

export enum ShipType {
    SINGLETON = 'SINGLETON',
}

export default interface ShipState {
    id: string
    typ: ShipType
    status: ShipStatus
    index: Grid
    description: string
    pc_next: number
}
