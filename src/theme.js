import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // you can define your base styles here if needed
  },
  // optionally, you can define breakpoints and other theme stuff
});

theme = responsiveFontSizes(theme); // <- this auto-scales font based on breakpoints

export default theme;
