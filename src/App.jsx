import { Toolbar } from "@mui/material";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Home />
    </>
  );
}

export default App;
