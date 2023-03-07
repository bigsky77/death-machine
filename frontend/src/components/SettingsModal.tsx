import * as React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WalletIcon from '@mui/icons-material/Wallet';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import ConnectWallet from './ui_settings/ConnectWallet'
import { SxProps } from "@mui/material";
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { BLANK_COLOR } from "../constants/constants";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SettingModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const makeshift_button_style = {border: "1px solid black",
                                  borderRadius: "0",
                                  marginLeft: "0.6rem",
                                  marginRight: "0.2rem",
                                  height: "2rem",
                                  width: "2rem",
                                  backgroundColor: BLANK_COLOR,
                                  '&:hover': {
                                    border: '2px solid #FC72FF',
                                    boxShadow: '4px 4px 0px #000000'}
                                 };
  
  const MenuItemStyled = ({ children, sx = {}, disabled=false }: { children: React.ReactNode; sx?: SxProps; disabled?: boolean }) => {
        return (
            <MenuItem sx={{pl:5, color:'#222222'}} disabled={disabled}>
                {children}
            </MenuItem>
        )
  };
  
  return (
    <div>
      <Button onClick={handleOpen} sx={makeshift_button_style}><SettingsIcon sx={{color: 'black' }}/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
        <Paper sx={{ width: '100%', maxWidth: '100%', backgroundColor:'#ffffff00'}} elevation={0}>
          <MenuList>
            <ListItemText sx={{textAlign:'center', pb:2}}>Welcome to DEATH-MACHINE</ListItemText>
          <Divider />
          
            <MenuItemStyled>
              <ListItemIcon>
              <EmojiEventsIcon fontSize="small" />
              </ListItemIcon>
              <LeaderboardModal />
            </MenuItemStyled>
            
            <MenuItemStyled>
              <ListItemIcon>
                <WalletIcon fontSize="small" />
              </ListItemIcon>
                <WalletModal /> 
              </MenuItemStyled>

            <MenuItemStyled>
              <ListItemIcon>
                <LibraryBooksIcon fontSize="small" />
              </ListItemIcon>
                <ManualModal /> 
              </MenuItemStyled>
          
          <Divider />

            <MenuItemStyled>
              <a
                  target="_blank" rel="noopener noreferrer"
                  href="https://twitter.com/bigsky_7"
                  style={{display:'flex',flexDirection:'row'}}
              >
                  <ListItemIcon>
                      <TwitterIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Twitter</ListItemText>
              </a>
            </MenuItemStyled>
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, color: 'black' }}>
          </Typography>
        </MenuList>
        </Paper>
        </Box>
      </Modal>
    </div>
  );
}

function WalletModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} sx={{color: 'black'}}>Connect Wallet</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, color: 'black'}}>
          <h2 id="child-modal-title" sx={{color: 'black'}}></h2>
          <p id="child-modal-description" sx={{color: 'black'}}>
          </p>
          <ConnectWallet sx={{color: 'black'}}>Connect Wallet</ConnectWallet> 
          <Button onClick={handleClose} sx={{color: 'black'}}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function LeaderboardModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} sx={{color: 'black'}}>Leaderboard</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, color: 'black'}}>
          <h2 id="child-modal-title" sx={{color: 'black'}}></h2>
          <p id="child-modal-description" sx={{color: 'black'}}>
          </p>
          <ConnectWallet sx={{color: 'black'}}>Connect Wallet</ConnectWallet> 
          <Button onClick={handleClose} sx={{color: 'black'}}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function ManualModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} sx={{color: 'black'}}>Manual</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, color: 'black'}}>
          <h2 id="child-modal-title" sx={{color: 'black'}}></h2>
          <p id="child-modal-description" sx={{color: 'black'}}>
          </p>
          <ConnectWallet sx={{color: 'black'}}>Connect Wallet</ConnectWallet> 
          <Button onClick={handleClose} sx={{color: 'black'}}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
