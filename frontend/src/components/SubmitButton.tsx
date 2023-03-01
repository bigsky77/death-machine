import { Trans, useTranslation } from "react-i18next";
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
    const makeshift_button_style = {border: "1px solid black", marginLeft: "0.2rem", marginRight: "0.2rem", height: "2rem", width: "3rem", backgroundColor: BLANK_COLOR };

    return (
        // <Tooltip title={t("submission")} arrow>
        <div >
            <button
                style={makeshift_button_style}
                id={"submit-button"}
                onClick={() => handleClickSubmit()}
                className={"big-button"}
                disabled={isPending}
            >
                {isPending ? (
                    <CircularProgress size="20px" color="inherit" />
                ) : (
                   <SendIcon sx={{color: "black"}}/> 
                )}
            </button>
        </div>
        // </Tooltip>
    );
}

