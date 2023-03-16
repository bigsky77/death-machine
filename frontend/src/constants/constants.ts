import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const BLANK_COLOR = '#f2f1ed' 

export const DB_NAME = 'DEATHMACHINE'
export const N_CYCLES = 49
export const INSTRUCTION_KEYS = ['w','a','s','d'];
export const DIM = 15
export type InstructionKey = typeof INSTRUCTION_KEYS[number];

export const INSTRUCTION_ICON_MAP = {
    // w: "expand_less",
    w: "arrow_upward",
    a: "arrow_back",
    s: "arrow_downward",
    d: "arrow_forward",
    x: "minimize",
    k: "add",
    h: "loop",
};

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const atomType = ["STAR","STAR", "STAR", "STAR","PLANET", "PLANET", "BLANK", "BLANK", "BLANK", "BLANK","ENEMY"];

const initialArray = Array(225).fill("").map((item, index) => ({
  id: `star${index + 1}`,
  typ: atomType[Math.floor(Math.random() * 11)],
  status: "ACTIVE",
  index: { x: Math.floor(index / 15), y: index % 15 },
}));


export const BLANK_SOLUTION: Solution = {
    ships: [
        {id: 'ship0', type: 1, status: 1, index: { x:3, y:3 }, description: 1, pc_next: 0, selected: false},
        {id: 'ship1', type: 1, status: 1, index: { x:4, y:4 }, description: 2, pc_next: 0, selected: false},
        {id: 'ship2', type: 1, status: 1, index: { x:3, y:5 }, description: 3, pc_next: 0, selected: false},
    ],
    programs: ['x,x,x,x,x,x,x', 'x,x,x,x,x,x,x', 'x,x,x,x,x,x,x'],
    atoms: initialArray,
}
