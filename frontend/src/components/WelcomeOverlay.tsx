import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import gruvMachine from '../../public/gruv-machine.png'
import Image from 'next/image'
import { BLANK_COLOR } from "../constants/constants";
import  ZKConnectApp from "./ui_settings/ZKConnectApp";

function WelcomeOverlay({ handleWelcomeClose, isMobile}) {

return (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    }}
  >
    <Box
      sx={{
        width: '80%',
        maxWidth: '500px',
        backgroundColor: '#f2f1ed',
        borderRadius: 1,
        border: '4px solid #FC72FF',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h2" sx={{ fontSize: '2rem', color: 'black', mb: 2, fontWeight: 'bold', textDecoration: 'underline' }}>
          DEATH-MACHINE️
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1rem', color: 'black', mb: 3 }}>
          Welcome to Death-Machine! A fully on-chain game that leverages <span style={{ fontWeight: 'bold', color: '#FC72FF', textDecoration: ''}}>zero-knowledge cryptography</span> to power a novel proof-of-play consensus mechanism.
          <br></br>
          <br></br>
          We are currently in beta testing.  If you want a sneak peak, generate a proof that you follow <span style={{ color: '#1DA1F2', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => window.open('https://twitter.com/__zkhack__')}>@__zkhack__</span> on Twitter!
          <br></br>
        </Typography>
        <ZKConnectApp handleWelcomeClose={handleWelcomeClose}/>
      </Box>
    </Box>
  </Box>
);
}



export default function WelcomeApp({generateBoard}) {
  const [showWelcome, setShowWelcome] = useState(true);

  function handleWelcomeClose() {
    setShowWelcome(false);
    generateBoard();
  }

  return (
    <>
      {showWelcome && <WelcomeOverlay handleWelcomeClose={handleWelcomeClose} />}
    </>
  );
}
