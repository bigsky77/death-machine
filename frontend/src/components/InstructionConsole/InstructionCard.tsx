import Stack from '@mui/material/Stack';
import { Box } from "@mui/material";
import { InputBase } from "@mui/material";
import TextField from '@mui/material/TextField';
import { spacing } from '@mui/system';
import React, { KeyboardEventHandler, useState } from "react";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {
    InstructionKey,
    INSTRUCTION_ICON_MAP,
    INSTRUCTION_KEYS,
    Item,
} from "../../constants/constants";
import SingleInstruction from "./SingleInstruction";
import NewInstruction from "./NewInstruction";
import { useTranslation } from "react-i18next";
import styles from "../../../styles/Home.module.css";
import Image from 'next/image'
import Starship from '../../../public/starship.png'
import Grid from "../../types/Grid";

interface ShipInputProps {
    shipIndex: number;
    position: Grid;
    onPositionChange: (shipIndex: number, position: Grid) => void;
    id: number,
    shipSelected,
    selectShip,
    program: string;
    pc: number;
    onProgramChange: (mechIndex: number, program: string) => void;
    onProgramDelete?: (mechIndex: number) => void;
    handleKeyDown: (event) => void;
    handleKeyUp: (event) => void;
}

export default function InstructionCard(
    {
    shipIndex,
    position,
    onPositionChange,
    id,
    shipSelected,
    selectShip,
    program, 
    pc, 
    onProgramChange,
    onProgramDelete,
    handleKeyDown: onKeyDown,
    handleKeyUp}: ShipInputProps) {
  const { t } = useTranslation();

  const instructions: string[] = program ? program.split(",") : [];
  const programLength = instructions.length;
  const currentInstructionIndex = pc % programLength;
  const PROGRAM_SIZE_MAX = 6;

  const [selectedInstructionIndex, setSelectedInstructionIndex] = useState<number>(null);
  const [selectedNewInstruction, setSelectedNewInstruction] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < 7) {
        const nextBox = document.getElementById(`box-${nextIndex}`);
        nextBox.focus();
      }
    }
  };
  
  const handleKeyDown: KeyboardEventHandler = (event) => {
        if (event.code === "Backspace") {
            // Backspace - Remove last instruction
            const newProgram = instructions.slice(0, -1);
            onProgramChange(shipIndex, newProgram.join(","));
        } else {
            onKeyDown(event);
            console.log("program", instructions)
        }
  };
  
  const handleChangeInstruction: KeyboardEventHandler = (event) => {
      const instruction = event.key.toLowerCase();
      if (["Backspace", "Delete"].includes(event.key)) {
          // Remove instruction at selected index
          const newProgram = [
              ...instructions.slice(0, selectedInstructionIndex),
              ...instructions.slice(selectedInstructionIndex + 1),
          ];
          onProgramChange(shipIndex, newProgram.join(","));
          setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (event.key === "ArrowLeft") {
          setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (event.key === "ArrowRight") {
          setSelectedInstructionIndex((prev) => (prev < instructions.length - 1 ? prev + 1 : prev));
      } else if (Object.keys(INSTRUCTION_ICON_MAP).includes(instruction)) {
          const newInstructions = [...instructions];
          newInstructions[selectedInstructionIndex] = instruction;
          onProgramChange(shipIndex, newInstructions.join(","));
      }
  };

  const handleInsertInstruction = (instruction) => {
        if (instructions.length > PROGRAM_SIZE_MAX) {
            return;
        } else {
            const newProgram = [...instructions, instruction].join(",");
            onProgramChange(shipIndex, newProgram);
        }
  };
  
  return(
      <>
      <Box display="flex" onClick={() => selectShip(shipIndex)} sx={{borderRadius: "1",
                                                       backgroundColor: shipSelected ? '#FFFFFFFF' : "",
                                                       boxShadow: shipSelected ? "4" : "",
                                                       border: shipSelected ? "1px solid #FC72FF" : "1px solid black",
                                                       height: "40px", pt: "5px", 
                                                       ":hover": {border: '2px solid #FC72FF', boxShadow: '4px 4px 0px #000000'} }}>
      <Image src={Starship} height={30} sx={{height: "10px", width: "20px", color: "black"}}/>
      
      <Stack spacing={2} direction="row" ml={1.5} pt={0.2} mb={2}>
        <div className={styles.programWrapper} style={{height: "25px", 
                                              borderRadius: "5px", 
                                              backgroundColor: "#FFFFFF00" }}>
        <input
            className={styles.program}
            onChange={(event) => {
                if (isNaN(parseInt(event.target.value))) return;
                onPositionChange(shipIndex, {
                    ...position,
                    x: parseInt(event.target.value),
                });
            }}
            defaultValue={position.x}
            value={position.x}
            style={{
                width: "25px",
                height: "25px",
                textAlign: "center",
                border: "1px solid #CCCCCC",
                borderRadius: "2px 0 0 2px",
            }}
        ></input>

        <input
            className={styles.program}
            onChange={(event) => {
                if (isNaN(parseInt(event.target.value))) return;
                onPositionChange(shipIndex, {
                    ...position,
                    y: parseInt(event.target.value),
                });
            }}
            defaultValue={position.y}
            value={position.y}
            style={{
                width: "25px",
                height: "25px",
                textAlign: "center",
                marginRight: "0.8rem",
                border: "1px solid #CCCCCC",
                borderLeft: "0px",
                borderRadius: "0 2px 2px 0",
            }}
        ></input>
        {instructions.map((instruction, index) => (
           <SingleInstruction
                    key={`input-row-${shipIndex}`}
                    instruction={instruction}
                    active={currentInstructionIndex === index}
                    selected={selectedInstructionIndex === index}
                    onSelect={() => {
                        setSelectedInstructionIndex(index);
                        setSelectedNewInstruction(false);
                    }}
                    onBlur={() => setSelectedInstructionIndex((prev) => (prev === index ? null : prev))}
                    onKeyUp={handleChangeInstruction}
                />
            ))}
          <NewInstruction
                      onInsert={handleInsertInstruction}
                      onSelect={() => {
                          setSelectedInstructionIndex(null);
                          setSelectedNewInstruction(true);
                      }}
                      onBlur={() => setSelectedNewInstruction(false)}
                      selected={selectedNewInstruction}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyDown}
                  />
          </div>
        </Stack>
        </Box>
      </>
    );
  }


 
