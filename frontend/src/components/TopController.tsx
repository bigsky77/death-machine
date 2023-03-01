import PausePresentationIcon from '@mui/icons-material/PausePresentation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import React from "react";
import styles from "../../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { BLANK_COLOR } from "../constants/constants";
import { Box } from "@mui/material";

export default function TopController() {
  const makeshift_button_style = {border: "1px solid black", marginLeft: "0.2rem", marginRight: "0.2rem", height: "2rem", width: "2rem", backgroundColor: BLANK_COLOR };
// const makeshift_button_style = { marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };
  const { t } = useTranslation();
  const animationFrame = 49;
  const n_cycles = 0;
  const animationState = true;
  
  return(        
    <>    
      <Box
            gap={1}
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "28rem",
                backgroundColor: BLANK_COLOR,
                p: "1rem",
                mt: "1rem",
                border: 1,
                borderRadius: 1,
                boxShadow: 3,
            }}
        >
        <p
                  style={{
                      padding: "0",
                      textAlign: "center",
                      verticalAlign: "middle",
                      width: "6.5rem",
                      margin: "0 0.5rem 0 0",
                      // width: "100px" /* Make room for dynamic text */,
                      height: "20px",
                      lineHeight: "20px",
                      fontSize: "1rem",
                      color: 'black',
                  }}
              >
                  {" "}
                  {t("frame ")}# {animationFrame} / {n_cycles}
        </p>
              
        <input
                id="typeinp"
                type="range"
                min="0"
                max={n_cycles}
                value={animationFrame}
              //  onChange={handleSlideChange}
                step="1"
                style={{ width: "6.5rem" }}
                disabled={animationState == 'Run'}
        />

        <button style={makeshift_button_style}>
          <i className="material-icons" style={{ fontSize: "1.2rem" }}>
            <PlayArrowIcon sx={{color: "black"}} />
          </i>
        </button>
        
        <button style={makeshift_button_style}>
          <i className="material-icons" style={{ fontSize: "1.2rem" }}>
            <PausePresentationIcon sx={{color: "black"}}/>
          </i>
        </button>

       <button style={makeshift_button_style}>
          <i className="material-icons" style={{ fontSize: "1.2rem" }}>
            <FastRewindIcon sx={{color: "black"}}/>
          </i>
      </button>

      <button style={makeshift_button_style}>
          <i className="material-icons" style={{ fontSize: "1.2rem" }}>
            <FastForwardIcon sx={{color: "black"}}/>
          </i>
      </button>
      
      </Box>
    </>
  );
}
