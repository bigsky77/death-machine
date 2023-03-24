import React from "react";
import Image from 'next/image'
import styles from "../../../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import { BLANK_COLOR } from "../constants/constants";
import { Box } from "@mui/material";

import SettingsModal from "./SettingsModal"
import NewBoardButton from "./NewBoard"
import SubmitButton from './SubmitButton'

import deathmachine from '../../styles/assets/death-machine.png'

export default function MainController({generateGameBoard, handleClickSubmit, txnPending, address}: props) {
  
  return(        
    <>
        <Box
            gap={0.01}
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                alignItems: "center",
                width: "28rem",
                height: "4rem",
                backgroundColor: BLANK_COLOR,
                p: "0.1rem",
                mt: "1rem",
                border: '2px solid #303030',
                borderRadius: 0,
                boxShadow: '4px 4px 0px #000000',
            }}
        >
          <Image src={deathmachine} height={50} sx={{height: "10px", width: "10px", color: "black"}} />
          <SettingsModal />
          <NewBoardButton generateGameBoard={generateGameBoard}/>
      <SubmitButton handleClickSubmit={handleClickSubmit} txnPending={txnPending} address={address}/>
      </Box>
    </>
  );
}
