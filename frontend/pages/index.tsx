import React, { useMemo, useState, useEffect } from "react";
import Layout from '../src/components/Layout'
import { BLANK_SOLUTION, DIM, N_CYCLES } from "../src/constants/constants";
import { programsToInstructionSets, packProgram } from "../src/utils/programPacker";
import { DEATHMACHINE_ADDR, DEATHMACHINE_ABI } from "../src/components/death_machine_contract";
import { useAllEvents } from "../lib/api"
import { Grid } from "../src/components/Grid"
import simulator from "../src/components/simulator";
import { BoardConfig } from "../src/types/BordConfig";
import ShipState, {ShipStatus, ShipType} from '../src/types/ShipState';
import AtomState, {AtomStatus, AtomType} from '../src/types/AtomState';
import loadBoard from "../src/utils/loadBoard";

export default function Home() {

  const [shipInitPositions, setShipInitPositions] = useState<Grid[]>(BLANK_SOLUTION.ships.map((ship) => ship.index));
  const [shipSelected, updateShipSelected] = useState<[]>(BLANK_SOLUTION.ships.map((ship) => ship.selected));
  console.log("shipInitPositions", shipInitPositions);
  const [ATOMS, updateAtoms] = useState<Grid[]>(BLANK_SOLUTION.atoms.map((atom) => atom.index));
  const [atomType, updateAtomType] = useState<Grid[]>(BLANK_SOLUTION.atoms.map((atom) => atom.typ));

  const [shipDescriptions, setShipDescriptions] = useState<string[]>(
        BLANK_SOLUTION.ships.map((ship) => ship.description)
    );
  const [programs, setPrograms] = useState<string[]>(BLANK_SOLUTION.programs);
  const [pc, setPc] = useState(0);
  
  const [animationState, setAnimationState] = useState("Stop");
  const [animationFrame, setAnimationFrame] = useState<number>(0);
  const [frames, setFrames] = useState<Frame[]>(49); 
  const [loop, setLoop] = useState<NodeJS.Timer>();

  const ANIM_FRAME_LATENCY_DAW = 300;
  const runnable = true; //placeholder

  const { data, error } = useAllEvents();
  console.log("data", data);

  const atomTypes = ["BLANK","ENEMY","STAR","BLANK"];

  useEffect(() => {
    if (data) {
      const board = data.DeathMachine[0].data;
      const newInitialArray = Array(225).fill("").map((item, index) => ({
        id: `star${index + 1}`,
        typ: atomTypes[board[index].type],
        status: "ACTIVE",
        index: board[index].index,
        raw_index: board[index].raw_index,
      }));
      updateAtoms(newInitialArray.map((atom) => (atom.index)));
      updateAtomType(newInitialArray.map((atom) => (atom.typ)));
      console.log("initial array", newInitialArray)
    }

  }, [data]);
 
  const selectShip = (id) => {
  updateShipSelected(prevState => {
    const newShipSelected = prevState.map((ship, index) => {
      if (index === id) {
        return true;
      } else {
        return false;
      }
    });
    console.log("newShipSelected", newShipSelected);
    return newShipSelected;
  });
  };

  const shipInitStates: ShipState[] = shipInitPositions.map((pos, ship_i) => {
          return {
              status: ShipStatus.ACTIVE,
              index: pos,
              id: `ship${ship_i}`,
              typ: ShipType.SINGLETON,
              description: shipDescriptions[ship_i],
              pc_next: 0,
          };
      });

    const atomInitStates: AtomState[] = ATOMS.map(function (atom, i) {
          return {
              status: "ACTIVE",
              index: atom,
              id: `atom${i}`,
              typ: atomType[i],
              raw_index: atom,
          };
      });
  
  async function generateBoard(){
    let instructionSets = programsToInstructionSets(programs);
    const boardConfig: BoardConfig = {
          dimension: DIM,
        };

      const simulatedFrames = simulator(
          N_CYCLES,
          shipInitStates,
          atomInitStates,
          instructionSets, // instructions
          boardConfig
      ) as Frame[];

      setFrames(simulatedFrames);
      setAnimationFrame(1);
  }

  function handleClick(mode: string) {
        if (mode == "NextFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev < N_CYCLES ? prev + 1 : prev));
        } else if (mode == "PrevFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
        }

        // Run simulation
        else if (mode == "ToggleRun") {
            // If in Run => go to Pause
            if (animationState == "Run") {
                clearInterval(loop); // kill the timer
                setAnimationState("Pause");
            }

            // If in Pause => resume Run without simulation
            else if (animationState == "Pause") {
                // Begin animation
                setAnimationState("Run");
                const latency = ANIM_FRAME_LATENCY_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames);
                    }, latency)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {
                // Parse program into array of instructions and store to react state
                let instructionSets = programsToInstructionSets(programs);
                console.log("running instructionSets", instructionSets);

                // Prepare input
                const boardConfig: BoardConfig = {
                    dimension: DIM,
                  };

                // Run simulation to get all frames and set to reference
                const simulatedFrames = simulator(
                    N_CYCLES,
                    shipInitStates,
                    atomInitStates,
                    instructionSets, // instructions
                    boardConfig
                ) as Frame[];
                setFrames(simulatedFrames);

                simulatedFrames.forEach((f: Frame, frame_i: number) => {
                     const s = f.atoms.map(function(v){return JSON.stringify(v)}).join('\n')
                     console.log(frame_i, f.atoms)
                     console.log(frame_i, f.notes)
                });
                // const final_delivery = simulatedFrames[simulatedFrames.length - 1].delivered_accumulated;

                // Begin animation
                setAnimationState("Run");
                const latency = ANIM_FRAME_LATENCY_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(simulatedFrames);
                    }, latency)
                );
                // console.log('Running with instruction:', instructions)
            }
        } else {
            // Stop
            clearInterval(loop); // kill the timer
            setAnimationState("Stop");
            setAnimationFrame((_) => 0);
        }
    }

  function handleSlideChange(evt) {
        if (animationState == "Run") return;

        const slide_val: number = parseInt(evt.target.value);
        setAnimationFrame(slide_val);
    }
  
  const simulationLoop = (frames: Frame[]) => {
        setAnimationFrame((prev) => {
            if (prev >= frames.length - 1) {
                return 0;
            } else {
                return prev + 1;
            }
        });
    };

  const calls = useMemo(() => {
    const program_instruction_set = programsToInstructionSets(programs);
    console.log("program_instruction_set", program_instruction_set)

    const args = packProgram(program_instruction_set, shipInitPositions);
    console.log("args", args);

    const tx = {
            contractAddress: DEATHMACHINE_ADDR,
            entrypoint: "submit_simulation",
            calldata: args,
        };
        return [tx];
    }, [programs, shipInitPositions]);

    return (
    <>
      <Layout
        animationFrame={animationFrame}
        frames={frames}
        callData={calls}
        pc={pc}
        shipSelected={shipSelected}
        selectShip={selectShip}
        onProgramsChange={setPrograms}
        programs={programs}
        midScreenControlProps={{
                    runnable: runnable,
                    animationFrame: animationFrame,
                    n_cycles: N_CYCLES,
                    animationState: animationState,
                }}
        midScreenControlHandleClick={handleClick}
        midScreenControlHandleSlideChange={handleSlideChange}
        shipInitPositions={shipInitPositions}
        onShipInitPositionsChange={setShipInitPositions}
        generateBoard={generateBoard}
        />
    </>
  )
}
