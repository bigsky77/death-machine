import AutorenewIcon from '@mui/icons-material/Autorenew';
import Button from '@mui/material/Button';
import { BLANK_COLOR } from "../constants/constants";
import React, { useState, useEffect } from "react";

export default function NewBoardButton({generateGameBoard}: props) {

  const makeshift_button_style = {border: "1px solid black",
                                  borderRadius: "0",
                                  marginLeft: "0.2rem",
                                  marginRight: "0.2rem",
                                  height: "2rem",
                                  width: "2rem",
                                  backgroundColor: BLANK_COLOR,
                                  '&:hover': {
                                    border: '2px solid #FC72FF',
                                    boxShadow: '4px 4px 0px #000000'}
                                 };
    return(
      <div>
        <Button onClick={generateGameBoard} sx={makeshift_button_style}>
          <AutorenewIcon sx={{color: 'black'}}/>
        </Button>
      </div>
    );
  }
