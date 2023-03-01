import PausePresentationIcon from '@mui/icons-material/PausePresentation';
import { shadows } from '@mui/system';
import Image from 'next/image'
import React, { KeyboardEventHandler, useState } from "react";
import styles from "../../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { BLANK_COLOR } from "../../constants/constants";
import { Box } from "@mui/material";
import EventReader from './EventReader'
import IconizedInstructionPanel from './IconizedInstructionPanel'
import Card from "@mui/material/Card";
import {
    InstructionKey,
    INSTRUCTION_ICON_MAP,
    INSTRUCTION_KEYS,
} from "../../constants/constants";
import Starship from '../../public/starship.png'
import StarShipBox from './StarShipBox'
import StarShipBoxBlank from './StarShipBoxBlank'
import InstructionCard from './InstructionCard.tsx'
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

export default function MainController({
  pc, 
  selectSpaceship, 
  spaceships, 
  onProgramsChange, 
  programs}: props) { 
  
  let programKeyDownInit = {};
  for (const key of INSTRUCTION_KEYS) {
      programKeyDownInit[key] = false;
  }
  const [programKeyDown, setProgramKeyDown] = useState<{ [key: InstructionKey]: boolean }>(programKeyDownInit);
  
  const handleKeyInputProgram = (event, typ: string) => {
    const key = event.key;
        if (INSTRUCTION_KEYS.includes(key)) {
            const bool = typ == "down" ? true : false;
            setProgramKeyDown((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy[key] = bool;
                return prev_copy;
            });
        }
    };
    
  const handleInstructionPanelPress = (key: InstructionKey) => {

        console.log("key pressed", key);
    };

  return(        
      <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "left",
                width: "28rem",
                height: "22rem",
                backgroundColor: BLANK_COLOR,
                p: "1rem",
                mt: "1rem",
                border: '2px solid #303030',
                borderRadius: 0,
                boxShadow: '4px 4px 0px #000000',
            }}
            gap={1}
        >
      <p
                  style={{
                      padding: "1px",
                      textAlign: "left",
                      verticalAlign: "middle",
                      margin: "0 0.5rem 0 0",
                      // width: "100px" /* Make room for dynamic text */,
                      height: "20px",
                      width: "100%",
                      lineHeight: "20px",
                      fontSize: "1.25rem",
                      color: 'black',
                  }}
              >
      </p>
        <IconizedInstructionPanel programKeyDown={programKeyDown}/>
          <InstructionCard id="a" 
                       spaceshipIndex={0} 
                       pc={pc} 
                       program={programs[0]} 
                       selectSpaceship={selectSpaceship}
                       onProgramChange={(index, program) =>
                                            onProgramsChange(programs.map((p, i) => (i === index ? program : p)))
                                         }
                       handleKeyDown={(event) => {
                                              handleKeyInputProgram(event, "down");
                                          }}
                       handleKeyUp={(event) => {
                                              handleKeyInputProgram(event, "up");
                                          }}
                       spaceships={spaceships} sx={{p: "2rem"}} />
          <InstructionCard id="b" 
                       spaceshipIndex={1} 
                       pc={pc} 
                       program={programs[1]} 
                       selectSpaceship={selectSpaceship}
                       onProgramChange={(index, program) =>
                                              onProgramsChange(programs.map((p, i) => (i === index ? program : p)))
                                          }
 
                       handleKeyDown={(event) => {
                                              handleKeyInputProgram(event, "down");
                                          }}
                       handleKeyUp={(event) => {
                                              handleKeyInputProgram(event, "up");
                                          }}
                       spaceships={spaceships} sx={{p: "2rem"}} />
          <InstructionCard id="c" 
                       spaceshipIndex={2} 
                       pc={pc} 
                       program={programs[2]} 
                       selectSpaceship={selectSpaceship}
                       onProgramChange={(index, program) =>
                                              onProgramsChange(programs.map((p, i) => (i === index ? program : p)))
                                          }
                       handleKeyDown={(event) => {
                                              handleKeyInputProgram(event, "down");
                                          }}
                      handleKeyUp={(event) => {
                                              handleKeyInputProgram(event, "up");
                                          }}
                       spaceships={spaceships} sx={{p: "2rem"}} />
        <Box mt={2} mb={4} sx={{border: '1px solid black', height: "40px", borderRadius: '8px', bgcolor: '#FC72FF'}} >
          <p style={{color: 'black', fontSize: '2.0rem', textAlign: "center", pt: '10px'}}>🛸 Generate ZK Proof!</p>
        </Box>
    </Box>
  );
}

