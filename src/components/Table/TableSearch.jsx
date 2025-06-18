import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TableSearch = ({ value, onChange, disabled = false }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        textAlign: "left",
        padding: "8px 16px",
        backgroundColor: "background.paper",
        borderBottom: "1px solid #ddd",
        zIndex: 10,
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        sx={{ width: "40%" }}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
      />
    </Box>
  );
};

export default TableSearch;
