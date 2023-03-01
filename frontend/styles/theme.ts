import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily:
            "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;",
    },
    palette: {
        primary: {
            main: "#FEB239",
        },
        secondary: {
            main: "#2d4249",
        },
        info: {
            main: "#DDDDDD",
        },
        divider: {
            main: "#FEB239",
        },
        softWhite: {
           main: "#faf9fa",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: "black",
                },
            },
        },
    },
});

export default theme;

