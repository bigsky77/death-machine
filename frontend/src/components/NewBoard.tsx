import AutorenewIcon from '@mui/icons-material/Autorenew';
import Button from '@mui/material/Button';
import { BLANK_COLOR } from "../constants/constants";
import React, { useState, useEffect } from "react";

export default function NewBoardButton({generateGameBoard}: props) {
    const makeshift_button_style = {border: "1px solid black", marginLeft: "0.2rem", marginRight: "0.2rem", height: "2rem", width: "2rem", backgroundColor: BLANK_COLOR };

    return(
      <div container>
        <Button onClick={generateGameBoard} style={makeshift_button_style} sx={{border: "1px solid black"}}>
          <AutorenewIcon sx={{color: 'black'}}/>
        </Button>
      </div>
    );
  }
