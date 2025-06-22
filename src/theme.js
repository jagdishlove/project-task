// theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  // Optional: customize breakpoints for responsiveness
});

theme = responsiveFontSizes(theme); // ⬅️ Automatically scales fonts based on screen size

export default theme;
