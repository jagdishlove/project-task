import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";

// eslint-disable-next-line react/display-name
const EditableCell = React.memo(
  ({ value, columnId, rowIndex, valueRef, disabled = false }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (valueRef && columnId !== undefined && rowIndex !== undefined) {
        if (!valueRef.current[rowIndex]) {
          valueRef.current[rowIndex] = {};
        }
        valueRef.current[rowIndex][columnId] = value;
      }
    }, [value, valueRef, columnId, rowIndex]);

    const handleChange = (e) => {
      const val = e.target.value;
      if (valueRef.current?.[rowIndex]) {
        valueRef.current[rowIndex][columnId] = val;
      }
    };

    return (
      <TextField
        variant="standard"
        defaultValue={value}
        inputRef={inputRef}
        onChange={handleChange}
        disabled={disabled}
        fullWidth
        InputProps={{
          sx: {
            paddingY: 0.5,
            fontSize: "0.875rem",
            textAlign: "center", // or "left" based on column
            height: "1.5rem", // consistent with MUI table cell height
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            height: "100%", // make sure it fits the cell
            display: "flex",
            alignItems: "center",
            my: 1,
          },
          "& input": {
            padding: 1,

            fontSize: "0.875rem",
          },
          width: "100%",
        }}
      />
    );
  }
);

export default EditableCell;
