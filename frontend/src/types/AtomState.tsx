import Grid from './Grid'

export enum AtomStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum AtomType {
    STAR = 'STAR',
    SKULL = 'SKULL',
    PLANET = 'PLANET',
}

export default interface AtomState {
    id: string
    typ: AtomType
    status: AtomStatus
    index: Grid
}
