import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const TableActions = ({ isEditing, onSave, onCancel, onEdit, onDelete }) => {
  if (isEditing) {
    return (
      <Box display="flex">
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={onSave}
          sx={{ mr: 1 }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={1}>
      <Button variant="outlined" size="small" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="outlined" size="small" color="error" onClick={onDelete}>
        Delete
      </Button>
    </Box>
  );
};

export default TableActions;
