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

interface SpaceShipInputProps {
    spaceshipIndex: number;
    id,
    spaceships, 
    selectSpaceship,
    program: string;
    pc: number;
    onProgramChange: (mechIndex: number, program: string) => void;
    onProgramDelete?: (mechIndex: number) => void;
    handleKeyDown: (event) => void;
    handleKeyUp: (event) => void;
}

export default function InstructionCard(
    {
    spaceshipIndex,
    id,
    spaceships,
    selectSpaceship,
    program, 
    pc, 
    onProgramChange,
    onProgramDelete,
    handleKeyDown: onKeyDown,
    handleKeyUp}: SpaceShipInputProps) {
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
            onProgramChange(spaceshipIndex, newProgram.join(","));
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
          onProgramChange(spaceshipIndex, newProgram.join(","));
          setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (event.key === "ArrowLeft") {
          setSelectedInstructionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (event.key === "ArrowRight") {
          setSelectedInstructionIndex((prev) => (prev < instructions.length - 1 ? prev + 1 : prev));
      } else if (Object.keys(INSTRUCTION_ICON_MAP).includes(instruction)) {
          const newInstructions = [...instructions];
          newInstructions[selectedInstructionIndex] = instruction;
          onProgramChange(spaceshipIndex, newInstructions.join(","));
      }
  };

  const handleInsertInstruction = (instruction) => {
        if (instructions.length > PROGRAM_SIZE_MAX) {
            return;
        } else {
            const newProgram = [...instructions, instruction].join(",");
            onProgramChange(spaceshipIndex, newProgram);
        }
  };
  
  return(
      <>
      <Box display="flex" onClick={() => selectSpaceship(id)} sx={{borderRadius: "4px", 
                                                       backgroundColor: spaceships[spaceshipIndex].selected ? '#FFFFFFFF' : "",
                                                       boxShadow: spaceships[spaceshipIndex].selected ? "4" : "", 
                                                       border: spaceships[spaceshipIndex].selected ? "1px solid #FC72FF" : "1px solid black", 
                                                       height: "40px", pt: "5px", 
                                                       ":hover": {border: '1px solid #FC72FF'} }} > 
      <Image src={Starship} height={30} sx={{height: "10px", width: "20px", color: "black"}}/>
      
      <Stack spacing={1} direction="row" ml={4} pt={0.2} mb={2}>
        <div className={styles.programWrapper} style={{height: "25px", 
                                              borderRadius: "5px", 
                                              backgroundColor: "#FFFFFF00" }}>
         {instructions.map((instruction, index) => (
           <SingleInstruction
                    key={`input-row-${spaceshipIndex}`}
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


 
