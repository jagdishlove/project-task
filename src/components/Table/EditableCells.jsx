import React, { memo, useRef } from "react";
import TextField from "@mui/material/TextField";

const EditableCell = memo(({ value, onChange, disabled = false }) => {
  const inputRef = useRef(null);

  return (
    <TextField
      inputRef={inputRef}
      variant="standard"
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      sx={{ minWidth: 100 }}
    />
  );
});

EditableCell.displayName = "EditableCell";

export default EditableCell;
