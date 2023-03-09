import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import gruvMachine from '../../public/gruvbox-smol.png';
import Image from 'next/image'

function WelcomeOverlay({ onClose }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
    >
      <Box
        sx={{
          width: '40%',
          height: '40%',
          backgroundColor: 'white',
          borderRadius: 0,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `url(${gruvMachine})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{pl: 10, alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="h1" sx={{ fontSize: 40, color: 'black' }}>
            DEATH-MACHINE &#9760; &#9881;
          </Typography>
        <TextField
          label="email"
          id="outlined-size-small"
          defaultValue="simon@bigsky.gg"
          size="small"
          sx={{pl: 0, pr: 1, top: 160}}
        />
        <TextField
          label="Starknet Address"
          id="outlined-size-small"
          defaultValue="0x1234567890"
          size="small"
          sx={{pl: 0, pr: 1, top: 160}}
        />
        </Box>
        <Button variant="contained" onClick={onClose}>
          Join Waitlist
        </Button>
      </Box>
    </Box>
  );
}

export default function WelcomeApp({generateBoard}: props) {
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
