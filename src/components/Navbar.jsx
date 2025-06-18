import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: "700" }}
        >
          Project Task
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
