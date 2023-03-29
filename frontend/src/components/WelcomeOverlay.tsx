import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import gruvMachine from '../../public/gruv-machine.png'
import Image from 'next/image'
import { BLANK_COLOR } from "../constants/constants";

function WelcomeOverlay({ onClose, isMobile}) {

  const openTelegram = () => {
    window.open('https://t.me/+o2ukH44rqIczMjgx', '_blank');
  };

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
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h2" sx={{ fontSize: '2rem', color: 'black', mb: 4 }}>
            DEATH-MACHINE️
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1rem', color: 'black', mb: 6 }}>
            Welcome to Death-Machine! A fully on-chain game that leverages zero-knowledge cryptography to create a novel proof-of-play blockchain. We are currently in closed beta testing.
          </Typography>
          <Button variant="contained" onClick={onClose}>
            Launch Death-Machine
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default function WelcomeApp({generateBoard}) {
  const [showWelcome, setShowWelcome] = useState(true);

  function handleWelcomeClose() {
    setShowWelcome(false);
    generateBoard();
  }

  return (
    <>
      {showWelcome && <WelcomeOverlay onClose={handleWelcomeClose} />}
    </>
  );
}
