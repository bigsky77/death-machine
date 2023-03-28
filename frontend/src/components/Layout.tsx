import React, { useCallback, useEffect, useState } from "react";
import Image from 'next/image'
import { useTranslation } from "react-i18next";
import {
  Box,
  ThemeProvider,
  Grid,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import theme from '../../styles/theme.ts'
import GameGrid from './GameGrid' 
import TopController from './TopController'
import MainController from './MainController'
import InstructionConsole from './InstructionConsole/InstructionConsole'
import EventReader from './EventReader'
import MidScreenControl from './ui_settings/MidScreenControl'
import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import WelcomeApp  from "./WelcomeOverlay";
import BlockExplorer  from "./BlockExplorer";

export default function Layout({animationFrame,
                                frames,
                                pc,
                                shipSelected,
                                selectShip,
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

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#2d4249ff',
        p: 2,
      }}
    >
      {isMobile ? (
        <WelcomeApp generateBoard={generateBoard} isMobile={isMobile} />
      ) : (
        <>

    <Grid container spacing={25} sx={{ height: 900, width: 1200, border: '2px  grey' }}
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        columnSpacing={2}
        gap={1}>

      <Grid item sx={{ width: '10%' }} xs={12} md={12}>
        <BlockExplorer />
      </Grid>

      <Grid item container direction="column" spacing={1} xs={6} md={6} pb={6.0}>
        <Grid item>
          <MainController generateGameBoard={generateGameBoard} handleClickSubmit={handleClickSubmit} txnPending={txnPending} address={address} />
        </Grid>

        <Grid item>
          <MidScreenControl runnable={midScreenControlProps.runnable} animationFrame={midScreenControlProps.animationFrame} n_cycles={midScreenControlProps.n_cycles} animationState={midScreenControlProps.animationState} handleClick={midScreenControlHandleClick} handleSlideChange={midScreenControlHandleSlideChange} />
        </Grid>

        <Grid item>
          <InstructionConsole pc={pc} shipSelected={shipSelected} selectShip={selectShip} onShipInitPositionsChange={onShipInitPositionsChange} shipInitPositions={shipInitPositions} onProgramsChange={onProgramsChange} programs={programs} />
        </Grid>
      </Grid>

      <Grid item xs={6} md={6} spacing={0} pb={16}>
        <Grid container direction="column" spacing={1} sx={{ width: 500, height: 400}}>
          <Grid item sx={{ flexGrow: 1 }}>
            <GameGrid animationFrame={animationFrame} frames={frames} shipSelected={shipSelected} shipInitPositions={shipInitPositions} />
          </Grid>
      </Grid>
     </Grid>
    </Grid>
        </>
      )}
    </Box>
    </ThemeProvider>
  );
}
