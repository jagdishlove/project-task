import { CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import theme from "./theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Toolbar />
        <Home />
      </ThemeProvider>
    </>
  );
}

export default App;
