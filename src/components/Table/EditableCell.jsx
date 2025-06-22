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
        sx={{ minWidth: 100 }}
      />
    );
  }
);

export default EditableCell;
