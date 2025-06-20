import React, { memo, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";

const EditableCell = memo(({ value, row, column, table, disabled = false }) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  // Keep local input in sync with external value (if needed)
  useEffect(() => {
    setInputValue(value); // ✅ Sync to props, not self
  }, [value]);

  const onBlur = () => {
    if (inputValue !== value) {
      table.options?.meta?.updateData?.(row.index, column.id, inputValue); // ✅ Correct method and value
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      onBlur={onBlur}
      variant="standard"
      value={inputValue || ""}
      onChange={(e) => setInputValue(e.target.value)}
      disabled={disabled}
      sx={{ minWidth: 100 }}
    />
  );
});

EditableCell.displayName = "EditableCell";

export default EditableCell;
