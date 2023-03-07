import { Trans, useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import { Tooltip } from "@mui/material";
import { CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import { BLANK_COLOR } from "../constants/constants";

export default function SubmitButton({
    handleClickSubmit,
    isPending = false,
}: {
    handleClickSubmit: () => void;
    isPending?: boolean;
}) {
    const { t } = useTranslation();

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

    return (
        // <Tooltip title={t("submission")} arrow>
        <div >
            <Button
                sx={makeshift_button_style}
                id={"submit-button"}
                onClick={() => handleClickSubmit()}
                //className={"big-button"}
                disabled={isPending}
            >
                {isPending ? (
                    <CircularProgress size="20px" color="inherit" />
                ) : (
                   <SendIcon sx={{color: "black"}}/> 
                )}
            </Button>
        </div>
        // </Tooltip>
    );
}

