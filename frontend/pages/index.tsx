import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useMemo, useState, useEffect } from "react";
import Layout from '../src/components/Layout'
import { BLANK_SOLUTION } from "../src/constants/constants";
import { coordinateToIndex, programsToInstructionSets, packProgram } from "../src/utils/programPacker";
import { DEATHMACHINE_ADDR, DEATHMACHINE_ABI } from "../src/components/death_machine_contract";
import { useAllEvents } from "../lib/api"
import { Grid } from "../src/components/Grid"

export default function Home() {

  const [shipInitPositions, setShipInitPositions] = useState<Grid[]>(BLANK_SOLUTION.ships.map((ship) => ship.index));
  const [spaceships, updateSpaceShips] = useState([{id: 1, location: 200, selected: false},
                                                   {id: 2, location: 150, selected: false},
                                                   {id: 3, location: 100, selected: false}])
  const [gameBoard, updateGameBoard] = useState(Array(225).fill(""));
  const [stars, updateStars] = useState(Array(40).fill(""));
  const [enemies, updateEnemies] = useState(Array(20).fill(""));

  const [programs, setPrograms] = useState<string[]>(BLANK_SOLUTION.programs);
  const [pc, setPc] = useState(0);
  
  const [animationState, setAnimationState] = useState("Stop");
  const [animationFrame, setAnimationFrame] = useState<number>(0);
  const [frames, setFrames] = useState<Frame[]>(49); 
  const [loop, setLoop] = useState<NodeJS.Timer>();
    
  const runnable = true; //placeholder
  const N_CYCLES = 100; //placeholder

  const { data } = useAllEvents();
  console.log("all events", data)

  async function generateGameBoard() {
          const events = await data.DeathMachine
          console.log("Death Events", events[0])

          let new_stars = events[0].star_array; 
          let star_arr = [];
          for (let i = 0; i < new_stars.length; i++){
            let res = coordinateToIndex(new_stars[i].x, new_stars[i].y);
            star_arr.push(res);
            }
          updateStars(star_arr);
          console.log("stars", stars);
 
          let new_enemy = events[0].enemy_array; 
          let enemy_arr = [];
          for (let i = 0; i < new_enemy.length; i++){
            let res = coordinateToIndex(new_enemy[i].x, new_enemy[i].y);
            enemy_arr.push(res);
            }
          updateEnemies(enemy_arr);

          let a = Math.floor(Math.random() * 225) + 1;
          let b = Math.floor(Math.random() * 225) + 1;  
          let c = Math.floor(Math.random() * 225) + 1;  
          updateSpaceShips([{id: "a", location: a, selected: false},
                            {id: "b", location: b, selected: false},
                            {id: "c", location: c, selected: false}])
  }

  const updateShipLocation = (id, newLocation) => {
      const updatedShips = spaceships.map((spaceship) => {
          if(spaceship.id === id) {
              return { ...spaceship, location: newLocation};
            }
            return spaceship;
        });
      updateSpaceShips(updatedShips);
    }

  const selectSpaceship= (id) => {
      const selectedSpaceShip = spaceships.map((spaceship) => {
          if(spaceship.id === id) {
              return { ...spaceship, selected: true};
            } else {
                return { ...spaceship, selected: false};
              }
            return spaceship;
        });
      updateSpaceShips(selectedSpaceShip);
    }
  
  function handleClick(mode: string) {

    }

  function handleSlideChange(evt) {
        if (animationState == "Run") return;

        const slide_val: number = parseInt(evt.target.value);
        setAnimationFrame(slide_val);
    }
  
  const simulationLoop = (frames: Frame[]) => {
        setAnimationFrame((prev) => {
            if (prev >= 100) {
                generateGameBoard();
                return 0;
            } else {
                generateGameBoard();
                return prev + 1;
            }
        });
    };

  const programCounterLoop = () => {
      setPc((prev) => {
          if(prev >= 7){
              generateGameBoard
              return 0;
            } else {
                return prev + 1;
              }
        });
    } 

    //
    // Handle click event for animation control
    //
    function handleClick(mode: string) {
        if (mode == "NextFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev < N_CYCLES ? prev + 1 : prev));
            setPc((prev) => (prev < 7 ? prev + 1 : prev));
        } else if (mode == "PrevFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
            setPc((prev) => (prev > 0 ? prev - 1 : prev));
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
                const latency = 300;
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames);
                        programCounterLoop();
                    }, latency)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {
                // Parse program into array of instructions and store to react state
                let instructionSets = programsToInstructionSets(programs);
                console.log("running instructionSets", instructionSets);

                setAnimationState("Run");
                const latency = 300;
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames);
                        programCounterLoop();
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

  const calls = useMemo(() => {
    const program_instruction_set = programsToInstructionSets(programs);
    console.log("program_instruction_set", program_instruction_set)

    const args = packProgram(program_instruction_set, shipInitPositions);
    console.log("args", args);

    const tx = {
            contractAddress: DEATHMACHINE_ADDR,
            entrypoint: "simulation",
            calldata: args,
        };
        return [tx];
    }, [programs]);

    return (
    <>
      <Layout 
        callData={calls}
        pc={pc}
        spaceships={spaceships} 
        stars={stars}
        enemies={enemies}
        selectSpaceship={selectSpaceship} 
        generateGameBoard={generateGameBoard}
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
        />
    </>
  )
}
