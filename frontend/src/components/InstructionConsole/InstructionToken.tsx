import { SxProps, Theme } from "@mui/material";
import Card from "@mui/material/Card";
import React, { MouseEventHandler, type ReactNode } from "react";

const InstructionToken = ({
    children,
    onClick,
    active,
    selected,
    sx,
}: {
    children: ReactNode;
    onClick: MouseEventHandler;
    active?: boolean;
    selected?: boolean;
    sx?: SxProps<Theme>;
}) => {
    return (
        <Card
            sx={{
                border: "1px solid #ffffff00",
                width: "1.4rem",
                mr: "1px",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                marginRight: "0.01rem",
                padding: "0.1rem",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid #FEB239",
                bgcolor: selected
                    ? "secondary.main"
                    : active
                    ? "primary.light"
                    : "#FEB239",
                color: selected
                    ? "secondary.contrastText"
                    : "primary.contrastText",
                ":hover": {
                    bgcolor: selected ? "secondary.main" : "secondary.light",
                    color: "secondary.contrastText",
                    border: "1px solid #ffffff00",
                },
                ...sx,
            }}
            variant="outlined"
            onClick={onClick}
        >
            {children}
        </Card>
    );
};

export default InstructionToken;
