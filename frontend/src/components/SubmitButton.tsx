import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { BLANK_COLOR } from "../constants/constants";
import SendIcon from '@mui/icons-material/Send';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import { useGameCompleteEvents } from '../../lib/api';

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

export default function SubmitButton({
  handleClickSubmit,
  txnPending = false,
  address,
}: {
  handleClickSubmit: () => void;
  txnPending?: boolean;
  address,
}) {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (txnPending) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [txnPending]);

  const makeshift_button_style = {
    border: "1px solid black",
    borderRadius: "0",
    marginLeft: "0.2rem",
    marginRight: "0.2rem",
    height: "2rem",
    width: "2rem",
    backgroundColor: BLANK_COLOR,
    "&:hover": {
      border: "2px solid #FC72FF",
      boxShadow: "4px 4px 0px #000000",
    },
  };

  return (
    <div>
      <Button
        sx={makeshift_button_style}
        id={"submit-button"}
        onClick={() => {
          if (txnPending) {
            setOpen(true);
          } else {
            handleClickSubmit();
          }
        }}
        //className={"big-button"}
        disabled={txnPending}
      >
        {txnPending ? (
          <CircularProgress size="20px" color="inherit" />
        ) : (
          <SendIcon sx={{ color: "black" }} />
        )}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Paper sx={{ width: '100%', maxWidth: '100%', backgroundColor:'#ffffff00'}} elevation={0}>
          <MenuList>
            <ListItemText sx={{textAlign:'center', pb:2}}>DEATH-MACHINE</ListItemText>
          <Divider />
          <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
            Player: {String(address).slice(0,6) + '...' + String(address).slice(-4)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Score: <LinearProgress variant="indeterminate" value={100} />
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Stars:
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Ships:
          </Typography>
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
