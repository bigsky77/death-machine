import React, { useCallback, useEffect, useState } from "react";
import Image from 'next/image'
import { useTranslation } from "react-i18next";
import {
  Box,
  ThemeProvider,
  Grid,
} from '@mui/material';
import theme from '../../styles/theme.ts'
import GameGrid from './GameGrid' 
import TopController from './TopController'
import MainController from './MainController'
import InstructionConsole from './InstructionConsole/InstructionConsole'
import EventReader from './EventReader'
import MidScreenControl from './ui_settings/MidScreenControl'
import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import   WelcomeApp  from "./WelcomeOverlay";

export default function Layout({animationFrame,
                                frames,
                                pc,
                                shipSelected,
                                updateShipSelected,
                                stars,
                                enemies,
                                selectSpaceship, 
                                generateGameBoard, 
                                onProgramsChange, 
                                programs, 
                                midScreenControlProps,
                                onShipInitPositionsChange,
                                shipInitPositions,
                                midScreenControlHandleClick,
                                midScreenControlHandleSlideChange,
                                handleClick, 
                                handleSlideChange,
                                generateBoard,
                                callData}: props) {

  const { account, address, status } = useAccount();
  const { execute } = useStarknetExecute({ calls: callData });
  
  const [hash, setHash] = useState<string>();
  
  const [settingOpen, setSettingOpen] = useState<boolean>(true);
  const [settingRenderMode, setSettingRenderMode] = useState<string>("menu");
  const [txnPending, setTxnPending] = useState<boolean>(false); 
  const [submitText, setSubmitText] = useState<string>();

  useEffect(() => {
        if (hash) {
            account
                .waitForTransaction(hash)
                .then(() => setSubmitText("Success!"))
                .catch((err) => {
                    setSubmitText("Error! Please try again.");
                    console.error(err);
                })
                .finally(() => setTxnPending(false));
        }
    }, [hash]);

  async function handleClickSubmit() {
        if (!account) {
            console.log("> wallet not connected yet");
            setSettingOpen((_) => true);
            setSettingRenderMode((_) => "connect");
            return;
        }

        console.log("> connected address:", String(address));

        console.log("> submitting args to main() on StarkNet:", callData);
        console.log("> submitting args to simulator() on StarkNet:", callData); setSubmitText("Submission pending...");
        try {
            setTxnPending(true);
            setHash("");

            const response = await execute();
            setHash(response.transaction_hash);
        } catch (err) {
            setTxnPending(false);
            console.error(err);
        }
        return;
    }
  
  return (  
    <>
      <ThemeProvider theme={theme}>
      <Box sx={{height: {md: "100vh"}, p: 10, pl: 24, backgroundColor: '#2d4249ff', border: '1px grey'}}>
          <Grid container 
                spacing={1} 
                sx={{ height: 800, width: 1400, p: 14, pl: 20, border: '1px grey' }}
                justifyContent="center" 
                alignItems="center" 
                display="flex" 
                flexDirection="column" 
                columnSpacing={0} gap={1}>
            <WelcomeApp generateBoard={generateBoard}/>
            <MainController generateGameBoard={generateGameBoard} handleClickSubmit={handleClickSubmit}/>
            <MidScreenControl runnable={midScreenControlProps.runnable}
                                    animationFrame={midScreenControlProps.animationFrame}
                                    n_cycles={midScreenControlProps.n_cycles}
                                    animationState={midScreenControlProps.animationState}
                                    handleClick={midScreenControlHandleClick}
                                    handleSlideChange={midScreenControlHandleSlideChange} />
            <InstructionConsole pc={pc}
                                shipSelected={shipSelected}
                                updateShipSelected={updateShipSelected}
                                onShipInitPositionsChange={onShipInitPositionsChange}
                                shipInitPositions={shipInitPositions}
                                onProgramsChange={onProgramsChange}
                                programs={programs}/>
            <Grid sx={{ width: 530, height: 500, border: '1px grey' }}>
            <GameGrid animationFrame={animationFrame}
                      frames={frames}
                      shipSelected={shipSelected}
                      shipInitPositions={shipInitPositions}
                      />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </> 
  );
}

