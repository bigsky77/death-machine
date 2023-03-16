import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import gruvMachine from '../../public/gameboard.png';
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
          borderRadius: 4,
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
            DEATH-MACHINE 💀 ⚙️
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1rem', color: 'black', mb: 6 }}>
            Welcome to Death-Machine! A fully on-chain game that leverages zero-knowledge cryptography to create a novel proof-of-play blockchain. We are currently in closed beta testing.
          </Typography>
          {isMobile ? <Image src={gruvMachine} alt="gruvMachine" width={300} height={200} sx={{border: '2px solid #303030', borderRadius: 1, boxShadow: '1px 1px 0px #000000'}} /> : ""}
          <Typography variant="body1" sx={{ fontSize: '1rem', color: 'black', mb: 6 }}>
            To learn more about the project and join our community, please join our Telegram chat!
          </Typography>
          <Button variant="contained" onClick={openTelegram}>
            Join Telegram Chat
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

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
